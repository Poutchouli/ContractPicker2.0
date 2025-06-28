<script>
  import { contractData, contractActions } from '../stores/index.js';

  let lineItems = [];
  
  contractData.subscribe(data => {
    lineItems = data.lineItems;
  });

  function updateLineItem(id, field, value) {
    contractActions.updateLineItem(id, { [field]: value });
  }

  function removeLineItem(id) {
    contractActions.removeLineItem(id);
  }

  const costTypes = [
    { value: 'one-off', label: 'One-time Payment' },
    { value: 'monthly', label: 'Monthly Recurring' },
    { value: 'yearly', label: 'Yearly Recurring' }
  ];
</script>

<div class="line-items">
  {#if lineItems.length === 0}
    <div class="empty-state">
      <p>No line items yet. Add your first service or product.</p>
      <button class="btn btn-primary" on:click={contractActions.addLineItem}>
        Add First Line Item
      </button>
    </div>
  {:else}
    <div class="line-items-header">
      <div>Service/Product</div>
      <div>Type</div>
      <div>Unit Cost</div>
      <div>Quantity</div>
      <div>Total</div>
      <div>Actions</div>
    </div>
    
    {#each lineItems as item (item.id)}
      <div class="line-item-row">
        <div class="item-description">
          <input
            type="text"
            bind:value={item.description}
            on:input={(e) => updateLineItem(item.id, 'description', e.target.value)}
            placeholder="Service or product description"
          />
        </div>
        
        <div class="item-type">
          <select
            bind:value={item.costType}
            on:change={(e) => updateLineItem(item.id, 'costType', e.target.value)}
          >
            {#each costTypes as type}
              <option value={type.value}>{type.label}</option>
            {/each}
          </select>
        </div>
        
        <div class="item-cost">
          <input
            type="number"
            bind:value={item.unitCost}
            on:input={(e) => updateLineItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        
        <div class="item-quantity">
          <input
            type="number"
            bind:value={item.quantity}
            on:input={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
            min="1"
            step="1"
          />
        </div>
        
        <div class="item-total">
          <span class="calculated-total">
            ${((item.unitCost || 0) * (item.quantity || 1)).toFixed(2)}
          </span>
          {#if item.costType !== 'one-off'}
            <span class="recurring-indicator">
              /{item.costType === 'monthly' ? 'mo' : 'yr'}
            </span>
          {/if}
        </div>
        
        <div class="item-actions">
          <button
            class="btn-icon btn-danger"
            on:click={() => removeLineItem(item.id)}
            title="Remove line item"
          >
            🗑️
          </button>
        </div>
      </div>
    {/each}
    
    <div class="add-item-row">
      <button class="btn btn-outline" on:click={contractActions.addLineItem}>
        + Add Another Line Item
      </button>
    </div>
  {/if}
</div>

<style>
  .line-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6c757d;
    background: #f8f9fa;
    border-radius: 6px;
  }

  .line-items-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 0.8fr 1fr 0.8fr;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    font-weight: 600;
    color: #495057;
    font-size: 0.9rem;
  }

  .line-item-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 0.8fr 1fr 0.8fr;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    transition: box-shadow 0.2s ease;
  }

  .line-item-row:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .line-item-row input,
  .line-item-row select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .line-item-row input:focus,
  .line-item-row select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .calculated-total {
    font-weight: 600;
    color: #28a745;
    font-size: 1rem;
  }

  .recurring-indicator {
    font-size: 0.8rem;
    color: #6c757d;
    margin-left: 0.25rem;
  }

  .btn-icon {
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }

  .btn-icon:hover {
    background: #f8f9fa;
  }

  .btn-icon.btn-danger:hover {
    background: #f8d7da;
  }

  .add-item-row {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  .btn-outline {
    background: none;
    border: 2px dashed #007bff;
    color: #007bff;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-outline:hover {
    background: #007bff;
    color: white;
  }

  @media (max-width: 1024px) {
    .line-items-header,
    .line-item-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .line-items-header {
      display: none;
    }
    
    .line-item-row {
      padding: 1.5rem;
    }
    
    .line-item-row > div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .line-item-row > div::before {
      content: attr(data-label);
      font-weight: 600;
      color: #495057;
      font-size: 0.8rem;
    }
  }
</style>
