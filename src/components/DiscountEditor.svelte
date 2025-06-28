<script>
  import { contractData, contractActions } from '../stores/index.js';

  let discounts = [];
  
  contractData.subscribe(data => {
    discounts = data.discounts;
  });

  function updateDiscount(index, field, value) {
    contractActions.updateDiscount(index, { [field]: value });
  }

  function removeDiscount(index) {
    contractActions.removeDiscount(index);
  }

  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' }
  ];
</script>

<div class="discounts">
  {#if discounts.length === 0}
    <div class="empty-state">
      <p>No discounts applied. Add discounts to reduce the total cost.</p>
      <button class="btn btn-primary" on:click={contractActions.addDiscount}>
        Add First Discount
      </button>
    </div>
  {:else}
    <div class="discounts-header">
      <div>Description</div>
      <div>Type</div>
      <div>Value</div>
      <div>Actions</div>
    </div>
    
    {#each discounts as discount, index (index)}
      <div class="discount-row">
        <div class="discount-description">
          <input
            type="text"
            bind:value={discount.description}
            on:input={(e) => updateDiscount(index, 'description', e.target.value)}
            placeholder="Discount description (e.g., Early bird discount)"
          />
        </div>
        
        <div class="discount-type">
          <select
            bind:value={discount.type}
            on:change={(e) => updateDiscount(index, 'type', e.target.value)}
          >
            {#each discountTypes as type}
              <option value={type.value}>{type.label}</option>
            {/each}
          </select>
        </div>
        
        <div class="discount-value">
          <div class="value-input-wrapper">
            <input
              type="number"
              bind:value={discount.value}
              on:input={(e) => updateDiscount(index, 'value', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step={discount.type === 'percentage' ? '1' : '0.01'}
              max={discount.type === 'percentage' ? '100' : undefined}
            />
            <span class="value-suffix">
              {discount.type === 'percentage' ? '%' : '$'}
            </span>
          </div>
        </div>
        
        <div class="discount-actions">
          <button
            class="btn-icon btn-danger"
            on:click={() => removeDiscount(index)}
            title="Remove discount"
          >
            🗑️
          </button>
        </div>
      </div>
    {/each}
    
    <div class="add-discount-row">
      <button class="btn btn-outline" on:click={contractActions.addDiscount}>
        + Add Another Discount
      </button>
    </div>
  {/if}
</div>

<style>
  .discounts {
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

  .discounts-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 0.8fr;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    font-weight: 600;
    color: #495057;
    font-size: 0.9rem;
  }

  .discount-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr 0.8fr;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    transition: box-shadow 0.2s ease;
  }

  .discount-row:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .discount-row input,
  .discount-row select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .discount-row input:focus,
  .discount-row select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .value-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .value-suffix {
    position: absolute;
    right: 0.75rem;
    color: #6c757d;
    font-weight: 500;
    pointer-events: none;
  }

  .value-input-wrapper input {
    padding-right: 2rem;
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

  .add-discount-row {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  .btn-outline {
    background: none;
    border: 2px dashed #28a745;
    color: #28a745;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-outline:hover {
    background: #28a745;
    color: white;
  }

  @media (max-width: 1024px) {
    .discounts-header,
    .discount-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .discounts-header {
      display: none;
    }
    
    .discount-row {
      padding: 1.5rem;
    }
    
    .discount-row > div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .discount-row > div::before {
      content: attr(data-label);
      font-weight: 600;
      color: #495057;
      font-size: 0.8rem;
    }
  }
</style>
