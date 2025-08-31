// Web Worker for heavy document processing
// Tách docx/xlsx processing ra khỏi main thread

class DocumentWorker {
  constructor() {
    this.worker = null;
    this.initWorker();
  }

  initWorker() {
    // Tạo worker inline để tránh file path issues
    const workerCode = `
      let docxLib = null;
      let xlsxLib = null;

      // Load libraries only when needed
      async function loadDocx() {
        if (!docxLib) {
          docxLib = await import('docx');
        }
        return docxLib;
      }

      async function loadXlsx() {
        if (!xlsxLib) {
          xlsxLib = await import('xlsx');
        }
        return xlsxLib;
      }

      self.onmessage = async function(e) {
        const { type, data, id } = e.data;
        
        try {
          let result;
          
          switch (type) {
            case 'process-docx':
              const docx = await loadDocx();
              // Xử lý docx với timeout
              result = await Promise.race([
                processDocx(docx, data),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Docx processing timeout')), 5000)
                )
              ]);
              break;
              
            case 'process-xlsx':
              const xlsx = await loadXlsx();
              // Xử lý xlsx với timeout
              result = await Promise.race([
                processXlsx(xlsx, data),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Xlsx processing timeout')), 5000)
                )
              ]);
              break;
              
            default:
              throw new Error('Unknown task type');
          }

          self.postMessage({ id, success: true, data: result });
        } catch (error) {
          self.postMessage({ id, success: false, error: error.message });
        }
      };

      async function processDocx(docx, data) {
        // Chunked processing để không block
        const chunks = [];
        const chunkSize = 1000; // Process 1000 items at a time
        
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          chunks.push(chunk);
          
          // Yield control back to main thread
          if (i % chunkSize === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
        
        return chunks;
      }

      async function processXlsx(xlsx, data) {
        // Similar chunked processing for Excel
        const chunks = [];
        const chunkSize = 500;
        
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          chunks.push(chunk);
          
          if (i % chunkSize === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
        
        return chunks;
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
  }

  async processDocument(type, data) {
    return new Promise((resolve, reject) => {
      const id = Date.now() + Math.random();
      
      const timeout = setTimeout(() => {
        reject(new Error(`Document processing timeout: ${type}`));
      }, 10000); // 10s timeout

      const handler = (e) => {
        if (e.data.id === id) {
          clearTimeout(timeout);
          this.worker.removeEventListener('message', handler);
          
          if (e.data.success) {
            resolve(e.data.data);
          } else {
            reject(new Error(e.data.error));
          }
        }
      };

      this.worker.addEventListener('message', handler);
      this.worker.postMessage({ type, data, id });
    });
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Singleton instance
let documentWorkerInstance = null;

export function getDocumentWorker() {
  if (!documentWorkerInstance) {
    documentWorkerInstance = new DocumentWorker();
  }
  return documentWorkerInstance;
}

export function destroyDocumentWorker() {
  if (documentWorkerInstance) {
    documentWorkerInstance.destroy();
    documentWorkerInstance = null;
  }
}