<script>
  import { contractData, contractActions } from '../stores/index.js';

  let metadata = {};
  
  contractData.subscribe(data => {
    metadata = data.contractMetadata;
  });

  function updateField(field, value) {
    contractActions.updateMetadata({ [field]: value });
  }
</script>

<div class="metadata-form">
  <div class="form-row">
    <div class="form-group">
      <label for="contractName">Contract Name *</label>
      <input
        id="contractName"
        type="text"
        bind:value={metadata.contractName}
        on:input={(e) => updateField('contractName', e.target.value)}
        placeholder="Enter contract name"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="clientName">Client Name *</label>
      <input
        id="clientName"
        type="text"
        bind:value={metadata.clientName}
        on:input={(e) => updateField('clientName', e.target.value)}
        placeholder="Enter client name"
        required
      />
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="effectiveDate">Effective Date *</label>
      <input
        id="effectiveDate"
        type="date"
        bind:value={metadata.effectiveDate}
        on:input={(e) => updateField('effectiveDate', e.target.value)}
        required
      />
    </div>
  </div>

  <div class="form-group">
    <label for="projectDescription">Project Description</label>
    <textarea
      id="projectDescription"
      bind:value={metadata.projectDescription}
      on:input={(e) => updateField('projectDescription', e.target.value)}
      placeholder="Brief description of the project or services"
      rows="3"
    ></textarea>
  </div>
</div>

<style>
  .metadata-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
