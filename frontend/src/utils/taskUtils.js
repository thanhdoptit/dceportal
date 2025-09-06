const API_URL = import.meta.env.VITE_API_URL;

// Add utility function for file URLs
export const getFileUrl = (file, selectedTask) => {
  console.log('Getting file URL for:', { file, selectedTask }); // Debug log

  if (!file) {
    console.warn('No file object provided');
    return null;
  }

  // Check if we have the required properties
  if (!file.filename) {
    console.warn('Missing filename in file object:', file);
    return null;
  }

  // Get taskId from either the file object or the selectedTask
  const taskId = file.taskId || (selectedTask && selectedTask.id);
  if (!taskId) {
    console.warn('Missing taskId for file:', file);
    return null;
  }

  // Create URL according to API route
  const url = `${API_URL}/api/tasks/${taskId}/attachments/${file.filename}`;
  console.log('Generated URL:', url); // Debug log
  return url;
};
