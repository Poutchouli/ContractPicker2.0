<script>
  import { contractData, contractActions, uiActions } from '../stores/index.js';

  let fileInput;
  let contract = {};
  
  contractData.subscribe(data => {
    contract = data;
  });

  function exportContract() {
    try {
      const contractJson = JSON.stringify(contract, null, 2);
      const blob = new Blob([contractJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${contract.contractMetadata?.clientName || 'draft'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      uiActions.addNotification('Contract exported successfully!', 'success');
    } catch (error) {
      uiActions.addNotification('Failed to export contract', 'error');
      console.error('Export error:', error);
    }
  }

  function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      uiActions.addNotification('Please select a valid JSON file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = contractActions.loadContract(e.target.result);
        if (result.success) {
          uiActions.addNotification('Contract imported successfully!', 'success');
        } else {
          uiActions.addNotification(`Import failed: ${result.error}`, 'error');
        }
      } catch (error) {
        uiActions.addNotification('Failed to read the contract file', 'error');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }

  function triggerFileInput() {
    fileInput.click();
  }

  function copyToClipboard() {
    try {
      const contractJson = JSON.stringify(contract, null, 2);
      navigator.clipboard.writeText(contractJson).then(() => {
        uiActions.addNotification('Contract JSON copied to clipboard!', 'success');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = contractJson;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        uiActions.addNotification('Contract JSON copied to clipboard!', 'success');
      });
    } catch (error) {
      uiActions.addNotification('Failed to copy to clipboard', 'error');
      console.error('Copy error:', error);
    }
  }

  function generateSampleContract() {
    const sampleContract = {
      schemaVersion: "1.0.0",
      contractMetadata: {
        contractName: "Sample Web Development Contract",
        clientName: "Acme Corporation",
        effectiveDate: "2025-07-01",
        projectDescription: "Complete website redesign and development project"
      },
      lineItems: [
        {
          id: "sample-1",
          description: "Website Design & Development",
          costType: "one-off",
          unitCost: 5000,
          quantity: 1
        },
        {
          id: "sample-2",
          description: "Monthly Hosting & Maintenance",
          costType: "monthly",
          unitCost: 150,
          quantity: 1
        },
        {
          id: "sample-3",
          description: "Annual SSL Certificate",
          costType: "yearly",
          unitCost: 100,
          quantity: 1
        }
      ],
      discounts: [
        {
          description: "Early Payment Discount",
          type: "percentage",
          value: 10
        }
      ]
    };

    contractActions.loadContract(sampleContract);
    uiActions.addNotification('Sample contract loaded!', 'info');
  }
</script>

<div class="import-export">
  <div class="section-grid">
    <!-- Import Section -->
    <div class="import-section">
      <h4>📤 Import Contract</h4>
      <p>Load an existing contract from a JSON file</p>
      <input
        bind:this={fileInput}
        type="file"
        accept=".json,application/json"
        on:change={handleFileImport}
        style="display: none;"
      />
      <div class="action-buttons">
        <button class="btn btn-outline" on:click={triggerFileInput}>
          📁 Choose JSON File
        </button>
        <button class="btn btn-secondary" on:click={generateSampleContract}>
          🔄 Load Sample
        </button>
      </div>
    </div>

    <!-- Export Section -->
    <div class="export-section">
      <h4>📥 Export Contract</h4>
      <p>Save your contract as a JSON file</p>
      <div class="action-buttons">
        <button class="btn btn-primary" on:click={exportContract}>
          💾 Download JSON
        </button>
        <button class="btn btn-secondary" on:click={copyToClipboard}>
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  </div>

  <!-- Contract Preview -->
  <div class="preview-section">
    <details>
      <summary>
        <h4>🔍 Contract JSON Preview</h4>
      </summary>
      <div class="json-preview">
        <pre><code>{JSON.stringify(contract, null, 2)}</code></pre>
      </div>
    </details>
  </div>

  <!-- Schema Information -->
  <div class="schema-info">
    <h4>ℹ️ File Format Information</h4>
    <div class="info-grid">
      <div class="info-item">
        <strong>Schema Version:</strong>
        <span>{contract.schemaVersion || 'Not set'}</span>
      </div>
      <div class="info-item">
        <strong>File Format:</strong>
        <span>JSON (JavaScript Object Notation)</span>
      </div>
      <div class="info-item">
        <strong>Compatibility:</strong>
        <span>Platform independent</span>
      </div>
    </div>
  </div>
</div>

<style>
  .import-export {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .import-section,
  .export-section {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .import-section h4,
  .export-section h4,
  .preview-section h4,
  .schema-info h4 {
    margin: 0 0 0.5rem 0;
    color: #495057;
    font-size: 1.1rem;
  }

  .import-section p,
  .export-section p {
    margin: 0 0 1rem 0;
    color: #6c757d;
    font-size: 0.9rem;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-outline {
    background: none;
    border: 2px solid #007bff;
    color: #007bff;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-outline:hover {
    background: #007bff;
    color: white;
  }

  .preview-section {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .preview-section details summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .preview-section details summary::-webkit-details-marker {
    display: none;
  }

  .preview-section details[open] summary::before {
    content: '▼';
  }

  .preview-section details:not([open]) summary::before {
    content: '▶';
  }

  .json-preview {
    margin-top: 1rem;
    max-height: 300px;
    overflow-y: auto;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
  }

  .json-preview pre {
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    line-height: 1.4;
    color: #495057;
  }

  .schema-info {
    background: #e3f2fd;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #2196f3;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item strong {
    color: #1976d2;
    font-size: 0.9rem;
  }

  .info-item span {
    color: #424242;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .section-grid {
      grid-template-columns: 1fr;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
