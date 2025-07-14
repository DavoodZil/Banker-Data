// Mock integrations for iframe integration
// These will communicate with the parent Angular application via postMessage

import { sendToParent } from './entities.js';

// Mock Core integration
export const Core = {
  InvokeLLM: async (prompt, options = {}) => {
    sendToParent('llm:invoke', { prompt, options });
    return {
      response: `Mock LLM response for: ${prompt}`,
      tokens: Math.floor(Math.random() * 100) + 50
    };
  },
  
  SendEmail: async (to, subject, body, options = {}) => {
    sendToParent('email:send', { to, subject, body, options });
    return {
      success: true,
      messageId: 'mock-email-' + Date.now()
    };
  },
  
  UploadFile: async (file, options = {}) => {
    sendToParent('file:upload', { fileName: file.name, fileSize: file.size, options });
    return {
      success: true,
      fileId: 'mock-file-' + Date.now(),
      url: 'https://mock-storage.com/mock-file-' + Date.now()
    };
  },
  
  GenerateImage: async (prompt, options = {}) => {
    sendToParent('image:generate', { prompt, options });
    return {
      success: true,
      imageUrl: 'https://mock-image-service.com/generated-' + Date.now() + '.png',
      prompt: prompt
    };
  },
  
  ExtractDataFromUploadedFile: async (fileId, options = {}) => {
    sendToParent('file:extract', { fileId, options });
    return {
      success: true,
      extractedData: {
        transactions: [
          { date: '2024-01-15', amount: -45.67, description: 'Grocery Store' },
          { date: '2024-01-14', amount: -120.00, description: 'Gas Station' }
        ],
        accounts: [
          { name: 'Checking Account', balance: 2500.00 }
        ]
      }
    };
  }
};

// Individual export aliases for backward compatibility
export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile; 