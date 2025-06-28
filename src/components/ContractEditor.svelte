<script>
  import { onMount } from 'svelte';
  import { contractData, calculatedTotals, contractActions, uiActions } from '../stores/index.js';
  import ContractMetadata from './ContractMetadata.svelte';
  import LineItemEditor from './LineItemEditor.svelte';
  import DiscountEditor from './DiscountEditor.svelte';
  import LiveCalculator from './LiveCalculator.svelte';
  import ImportExport from './ImportExport.svelte';

  let contract = {};
  let totals = {};
  
  // Subscribe to stores
  contractData.subscribe(data => {
    contract = data;
  });

  calculatedTotals.subscribe(calc => {
    totals = calc;
  });

  onMount(() => {
    // Initialize with a sample line item for demo
    if (contract.lineItems.length === 0) {
      contractActions.addLineItem();
    }
  });

  async function saveContract() {
    try {
      // Validate the contract first
      const validation = contractActions.validateCurrentContract();
      if (!validation.isValid) {
        const errorMessages = validation.errors.map(err => err.message).join(', ');
        uiActions.addNotification(`Validation failed: ${errorMessages}`, 'error');
        return;
      }

      // Save to backend
      const result = await contractActions.saveToBackend(contract);
      if (result.success) {
        uiActions.addNotification('Contract saved successfully!', 'success');
        console.log('Contract saved:', result.data);
      } else {
        uiActions.addNotification(`Save failed: ${result.error}`, 'error');
      }
    } catch (error) {
      uiActions.addNotification('Error saving contract', 'error');
      console.error('Save error:', error);
    }
  }

  function resetForm() {
    contractActions.resetContract();
    uiActions.addNotification('Contract form reset', 'info');
  }

  function backToDashboard() {
    uiActions.setView('dashboard');
  }
</script>

<div class="contract-editor">
  <div class="editor-header">
    <div class="header-content">
      <button class="btn btn-secondary" on:click={backToDashboard}>
        ← Back to Dashboard
      </button>
      <h2>Contract Editor</h2>
      <div class="header-actions">
        <button class="btn btn-secondary" on:click={resetForm}>Reset</button>
        <button class="btn btn-primary" on:click={saveContract}>Save Contract</button>
      </div>
    </div>
  </div>

  <div class="editor-layout">
    <div class="editor-main">
      <!-- Contract Metadata Section -->
      <div class="editor-section">
        <h3>📋 Contract Information</h3>
        <ContractMetadata />
      </div>

      <!-- Line Items Section -->
      <div class="editor-section">
        <div class="section-header">
          <h3>📝 Line Items</h3>
          <button class="btn btn-primary btn-small" on:click={contractActions.addLineItem}>
            Add Line Item
          </button>
        </div>
        <LineItemEditor />
      </div>

      <!-- Discounts Section -->
      <div class="editor-section">
        <div class="section-header">
          <h3>💰 Discounts</h3>
          <button class="btn btn-primary btn-small" on:click={contractActions.addDiscount}>
            Add Discount
          </button>
        </div>
        <DiscountEditor />
      </div>

      <!-- Import/Export Section -->
      <div class="editor-section">
        <h3>📤 Import/Export</h3>
        <ImportExport />
      </div>
    </div>

    <!-- Live Calculator Sidebar -->
    <div class="calculator-sidebar">
      <LiveCalculator {totals} />
    </div>
  </div>
</div>

<style>
  .contract-editor {
    max-width: 1400px;
    margin: 0 auto;
  }

  .editor-header {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content h2 {
    margin: 0;
    flex: 1;
    text-align: center;
    color: #333;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .editor-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
  }

  .editor-main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .editor-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .editor-section h3 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.25rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-header h3 {
    margin: 0;
  }

  .calculator-sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }

  .btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 1024px) {
    .editor-layout {
      grid-template-columns: 1fr;
    }
    
    .calculator-sidebar {
      position: static;
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
    
    .header-content h2 {
      text-align: center;
      order: -1;
    }
    
    .header-actions {
      justify-content: center;
    }
  }
</style>
