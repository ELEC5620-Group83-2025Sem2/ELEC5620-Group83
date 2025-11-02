import { getSupabaseClient } from '../../clients/supabaseClient.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

const MODULES_BUCKET = 'class-modules';

// Ensure the storage bucket exists (idempotent)
async function ensureModulesBucket(supabase) {
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      console.warn('Storage listBuckets error:', listErr.message || listErr);
      return; // do not hard-fail
    }
    const exists = (buckets || []).some(b => b.name === MODULES_BUCKET);
    if (!exists) {
      console.log(`Bucket '${MODULES_BUCKET}' not found. Creating...`);
      const { error: createErr } = await supabase.storage.createBucket(MODULES_BUCKET, {
        public: true
      });
      if (createErr) {
        console.warn('Storage createBucket error:', createErr.message || createErr);
      } else {
        console.log(`Bucket '${MODULES_BUCKET}' created.`);
      }
    }
  } catch (e) {
    console.warn('ensureModulesBucket exception:', e.message || e);
  }
}

export const listClassModules = async (req, res) => {
  try {
    const { classId } = req.params;
    const supabase = getSupabaseClient();

    const { data: modules, error: modErr } = await supabase
      .from('class_modules')
      .select('*')
      .eq('class_id', classId)
      .order('order_index', { ascending: true });
    if (modErr) return ErrorResponse.internalServerError('Failed to fetch modules').send(res);

    const moduleIds = (modules || []).map(m => m.id);
    let itemsByModule = {};
    if (moduleIds.length > 0) {
      const { data: items, error: itemErr } = await supabase
        .from('class_module_items')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index', { ascending: true });
      if (itemErr) return ErrorResponse.internalServerError('Failed to fetch module items').send(res);
      itemsByModule = (items || []).reduce((acc, it) => {
        (acc[it.module_id] = acc[it.module_id] || []).push(it);
        return acc;
      }, {});
    }

    const result = (modules || []).map(m => ({ ...m, items: itemsByModule[m.id] || [] }));
    res.status(200).json({ modules: result });
  } catch (err) {
    console.error('listClassModules error:', err);
    return ErrorResponse.internalServerError('An error occurred while fetching modules').send(res);
  }
};

export const createClassModule = async (req, res) => {
  try {
    const { classId } = req.params;
    const {
      title,
      description_richtext = '',
      order_index = 0,
      is_published = false,
      available_from = null,
      available_until = null
    } = req.body || {};

    if (!title) return ErrorResponse.badRequest('title is required').send(res);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('class_modules')
      .insert([{
        class_id: classId,
        title,
        description_richtext,
        order_index,
        is_published,
        available_from,
        available_until,
        created_by: req.user?.id || null
      }])
      .select()
      .single();
    if (error) return ErrorResponse.internalServerError('Failed to create module').send(res);
    res.status(201).json({ module: data });
  } catch (err) {
    console.error('createClassModule error:', err);
    return ErrorResponse.internalServerError('An error occurred while creating module').send(res);
  }
};

export const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const payload = req.body || {};
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('class_modules')
      .update(payload)
      .eq('id', moduleId)
      .select()
      .single();
    if (error) return ErrorResponse.internalServerError('Failed to update module').send(res);
    res.status(200).json({ module: data });
  } catch (err) {
    console.error('updateModule error:', err);
    return ErrorResponse.internalServerError('An error occurred while updating module').send(res);
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const supabase = getSupabaseClient();

    // Delete items first (cascade would handle, but we also clean storage if any)
    const { data: items } = await supabase
      .from('class_module_items')
      .select('id, file_storage_path')
      .eq('module_id', moduleId);

    if (items && items.length > 0) {
      const paths = items.map(i => i.file_storage_path).filter(Boolean);
      if (paths.length > 0) {
        const { error: delErr } = await supabase.storage.from(MODULES_BUCKET).remove(paths);
        if (delErr) console.warn('Storage remove error:', delErr.message);
      }
    }

    const { error } = await supabase
      .from('class_modules')
      .delete()
      .eq('id', moduleId);
    if (error) return ErrorResponse.internalServerError('Failed to delete module').send(res);
    res.status(200).json({ message: 'Module deleted' });
  } catch (err) {
    console.error('deleteModule error:', err);
    return ErrorResponse.internalServerError('An error occurred while deleting module').send(res);
  }
};

export const createModuleItem = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const {
      item_type,
      title,
      description = '',
      link_url = null,
      link_open_in_new_tab = true,
      content_richtext = null,
      order_index = 0
    } = req.body || {};

    if (!item_type || !title) return ErrorResponse.badRequest('item_type and title are required').send(res);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('class_module_items')
      .insert([{
        module_id: moduleId,
        item_type,
        title,
        description,
        link_url,
        link_open_in_new_tab,
        content_richtext,
        order_index,
        created_by: req.user?.id || null
      }])
      .select()
      .single();
    if (error) return ErrorResponse.internalServerError('Failed to create module item').send(res);
    res.status(201).json({ item: data });
  } catch (err) {
    console.error('createModuleItem error:', err);
    return ErrorResponse.internalServerError('An error occurred while creating item').send(res);
  }
};

export const updateModuleItem = async (req, res) => {
  try {
    const { moduleId, itemId } = req.params;
    const payload = req.body || {};
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('class_module_items')
      .update(payload)
      .eq('id', itemId)
      .eq('module_id', moduleId)
      .select()
      .single();
    if (error) return ErrorResponse.internalServerError('Failed to update item').send(res);
    res.status(200).json({ item: data });
  } catch (err) {
    console.error('updateModuleItem error:', err);
    return ErrorResponse.internalServerError('An error occurred while updating item').send(res);
  }
};

export const deleteModuleItem = async (req, res) => {
  try {
    const { moduleId, itemId } = req.params;
    const supabase = getSupabaseClient();

    const { data: existing } = await supabase
      .from('class_module_items')
      .select('file_storage_path')
      .eq('id', itemId)
      .eq('module_id', moduleId)
      .single();

    if (existing?.file_storage_path) {
      const { error: delErr } = await supabase.storage.from(MODULES_BUCKET).remove([existing.file_storage_path]);
      if (delErr) console.warn('Storage remove error:', delErr.message);
    }

    const { error } = await supabase
      .from('class_module_items')
      .delete()
      .eq('id', itemId)
      .eq('module_id', moduleId);
    if (error) return ErrorResponse.internalServerError('Failed to delete item').send(res);
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    console.error('deleteModuleItem error:', err);
    return ErrorResponse.internalServerError('An error occurred while deleting item').send(res);
  }
};

export const uploadModuleItemFile = async (req, res) => {
  try {
    const { moduleId, itemId } = req.params;
    console.log('Upload request:', { moduleId, itemId, hasFile: !!req.file });
    const supabase = getSupabaseClient();
    const file = req.file;
    if (!file) {
      console.error('No file in request');
      return ErrorResponse.badRequest('file is required').send(res);
    }
    console.log('File received:', file.originalname, file.mimetype, file.size);

    // Validate file size (50MB limit for Supabase free tier)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      console.error(`File too large: ${fileSizeMB}MB exceeds ${maxSizeMB}MB limit`);
      return ErrorResponse.badRequest(
        `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB. Please upload a smaller file.`
      ).send(res);
    }

    // Validate filename
    if (!file.originalname || file.originalname.length > 255) {
      return ErrorResponse.badRequest('Invalid filename').send(res);
    }

    const { data: moduleRow, error: modErr } = await supabase
      .from('class_modules')
      .select('class_id')
      .eq('id', moduleId)
      .single();
    if (modErr || !moduleRow) {
      console.error('Module lookup error:', modErr);
      return ErrorResponse.badRequest('Invalid module').send(res);
    }

    const classId = moduleRow.class_id;
    // Ensure bucket exists before uploading (idempotent)
    await ensureModulesBucket(supabase);
    const path = `${classId}/${moduleId}/${itemId}/${file.originalname}`;
    console.log('Uploading to path:', path);

    const { error: upErr } = await supabase
      .storage
      .from(MODULES_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });
    if (upErr) {
      console.error('Storage upload error:', upErr);
      // Provide more specific error messages
      if (upErr.statusCode === '413' || upErr.status === 413) {
        return ErrorResponse.badRequest('File is too large for storage').send(res);
      }
      if (upErr.statusCode === '403' || upErr.status === 403) {
        return ErrorResponse.forbidden('Storage RLS blocked the upload. Please ensure storage policies allow service role to insert into this bucket.').send(res);
      }
      return ErrorResponse.internalServerError(`Failed to upload file: ${upErr.message || 'Unknown error'}`).send(res);
    }
    console.log('File uploaded successfully');

    const { data: pub } = supabase.storage.from(MODULES_BUCKET).getPublicUrl(path);
    const publicUrl = pub?.publicUrl || null;
    console.log('Public URL:', publicUrl);

    const { data: updated, error: updErr } = await supabase
      .from('class_module_items')
      .update({
        file_storage_path: path,
        file_mime_type: file.mimetype,
        file_size_bytes: file.size,
        file_public_url: publicUrl
      })
      .eq('id', itemId)
      .eq('module_id', moduleId)
      .select()
      .single();
    if (updErr) {
      console.error('DB update error:', updErr);
      return ErrorResponse.internalServerError(`Failed to save file metadata: ${updErr.message || JSON.stringify(updErr)}`).send(res);
    }

    res.status(200).json({ item: updated });
  } catch (err) {
    console.error('uploadModuleItemFile error:', err);
    return ErrorResponse.internalServerError('An error occurred while uploading file').send(res);
  }
};


