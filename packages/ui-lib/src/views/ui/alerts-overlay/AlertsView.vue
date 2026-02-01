<script setup lang="ts">
/**
 * AlertsView - Showcase de componentes Alert e AlertDialog
 */
import { ref } from 'vue'
import { ComponentShowcase, CodeBlock, Alert, AlertDialog, Button } from '@/shared/components'
import { useToast, ToastProvider } from '@/modules/toast'

const toast = useToast()

// Alert visibility state
const showSuccessAlert = ref(true)
const showWarningAlert = ref(true)
const showBorderedInfoAlert = ref(true)
const showBorderedErrorAlert = ref(true)

// Alert Dialog state
const showInfoDialog = ref(false)
const showSuccessDialog = ref(false)
const showWarningDialog = ref(false)
const showDangerDialog = ref(false)

function handleDialogConfirm(type: string): void {
  toast.success(`${type} confirmed!`)
}

function resetDismissibleAlerts(): void {
  showSuccessAlert.value = true
  showWarningAlert.value = true
}

function resetBorderedAlerts(): void {
  showBorderedInfoAlert.value = true
  showBorderedErrorAlert.value = true
}

// Code examples
const alertBasicExample = `
<script setup>
import { Alert } from '@lugand/vue-ui-lib'
<\/script>

<template>
  <!-- Info Alert (default) -->
  <Alert title="Information">
    This is an informational message.
  </Alert>

  <!-- Success Alert -->
  <Alert variant="success" title="Success!">
    Your changes have been saved successfully.
  </Alert>

  <!-- Warning Alert -->
  <Alert variant="warning" title="Warning">
    Please review the following information carefully.
  </Alert>

  <!-- Error Alert -->
  <Alert variant="error" title="Error">
    An error occurred while processing your request.
  </Alert>
</template>
`

const alertDismissibleExample = `
<script setup>
import { ref } from 'vue'
import { Alert } from '@lugand/vue-ui-lib'

const showAlert = ref(true)
<\/script>

<template>
  <Alert
    v-if="showAlert"
    variant="success"
    title="Success!"
    dismissible
    @dismiss="showAlert = false"
  >
    This alert can be dismissed by clicking the × button.
  </Alert>
</template>
`

const alertBorderedExample = `
<template>
  <Alert variant="info" title="Bordered Alert" bordered>
    This alert has a border for extra emphasis.
  </Alert>
</template>
`

const alertCustomIconExample = `
<template>
  <!-- Custom icon -->
  <Alert variant="success" icon="🎉" title="Celebration!">
    You've completed all tasks!
  </Alert>

  <!-- No icon -->
  <Alert variant="warning" title="No Icon" :show-icon="false">
    This alert doesn't have an icon.
  </Alert>
</template>
`

const alertDialogExample = `
<script setup>
import { ref } from 'vue'
import { AlertDialog, Button } from '@lugand/vue-ui-lib'
import { useToast } from '@lugand/vue-ui-lib'

const showDeleteDialog = ref(false)
const toast = useToast()

function handleDelete() {
  // Perform delete operation
  toast.success('Item deleted successfully')
}
<\/script>

<template>
  <Button variant="danger" @click="showDeleteDialog = true">
    Delete Item
  </Button>

  <AlertDialog
    :is-open="showDeleteDialog"
    variant="danger"
    title="Delete Item?"
    message="This action cannot be undone. Are you sure?"
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="handleDelete"
    @cancel="showDeleteDialog = false"
    @close="showDeleteDialog = false"
  />
</template>
`
</script>

<template>
  <div class="alerts-view">
    <ToastProvider />

    <!-- Page Header -->
    <div class="alerts-view__header">
      <h1>Alerts & Dialogs</h1>
      <p class="subtitle">
        Inline alerts and confirmation dialogs for user feedback and important actions.
      </p>
    </div>

    <!-- 1. Basic Alerts -->
    <ComponentShowcase title="Alert - Variants"
      description="Four alert variants for different message types: info (default), success, warning, and error.">
      <template #preview>
        <div class="showcase-grid">
          <Alert variant="info" title="Information">
            This is an informational message to provide context or guidance.
          </Alert>

          <Alert variant="success" title="Success!">
            Your changes have been saved successfully.
          </Alert>

          <Alert variant="warning" title="Warning">
            Please review the following information carefully before proceeding.
          </Alert>

          <Alert variant="error" title="Error">
            An error occurred while processing your request. Please try again.
          </Alert>
        </div>
      </template>

      <template #code>
        <CodeBlock :code="alertBasicExample" language="vue" />
      </template>
    </ComponentShowcase>

    <!-- 2. Dismissible Alerts -->
    <ComponentShowcase title="Dismissible Alerts"
      description="Alerts can be dismissed by the user. Use the @dismiss event to handle closure.">
      <template #preview>
        <div class="showcase-controls">
          <Button variant="secondary" size="sm" @click="resetDismissibleAlerts">
            Reset Dismissible Alerts
          </Button>
        </div>
        <div class="showcase-grid">
          <Alert v-if="showSuccessAlert" variant="success" title="Dismissible Alert" dismissible
            @dismiss="showSuccessAlert = false">
            Click the × button to dismiss this alert.
          </Alert>
          <div v-else class="alert-dismissed">
            ✓ Alert was dismissed
          </div>

          <Alert v-if="showWarningAlert" variant="warning" title="Important Notice" dismissible
            @dismiss="showWarningAlert = false">
            This message will disappear when you dismiss it.
          </Alert>
          <div v-else class="alert-dismissed">
            ✓ Alert was dismissed
          </div>
        </div>
      </template>

      <template #code>
        <CodeBlock :code="alertDismissibleExample" language="vue" />
      </template>
    </ComponentShowcase>

    <!-- 3. Bordered Alerts -->
    <ComponentShowcase title="Bordered Alerts" description="Add a border for extra emphasis on important messages.">
      <template #preview>
        <div class="showcase-controls">
          <Button variant="secondary" size="sm" @click="resetBorderedAlerts">
            Reset Bordered Alerts
          </Button>
        </div>
        <div class="showcase-grid">
          <Alert v-if="showBorderedInfoAlert" variant="info" title="Bordered Info" bordered dismissible
            @dismiss="showBorderedInfoAlert = false">
            This alert has a border for extra visual emphasis.
          </Alert>
          <div v-else class="alert-dismissed">
            ✓ Alert was dismissed
          </div>

          <Alert v-if="showBorderedErrorAlert" variant="error" title="Critical Error" bordered dismissible
            @dismiss="showBorderedErrorAlert = false">
            Bordered alerts can also be dismissible.
          </Alert>
          <div v-else class="alert-dismissed">
            ✓ Alert was dismissed
          </div>
        </div>
      </template>

      <template #code>
        <CodeBlock :code="alertBorderedExample" language="vue" />
      </template>
    </ComponentShowcase>

    <!-- 4. Custom Icons -->
    <ComponentShowcase title="Custom Icons"
      description="Customize the icon or hide it completely using the icon prop and show-icon prop.">
      <template #preview>
        <div class="showcase-grid">
          <Alert variant="success" icon="🎉" title="Celebration!">
            You've completed all tasks! Great job!
          </Alert>

          <Alert variant="info" icon="💡" title="Pro Tip">
            Use keyboard shortcuts to work faster.
          </Alert>

          <Alert variant="warning" title="No Icon" :show-icon="false">
            This alert doesn't display an icon.
          </Alert>
        </div>
      </template>

      <template #code>
        <CodeBlock :code="alertCustomIconExample" language="vue" />
      </template>
    </ComponentShowcase>

    <!-- 5. AlertDialog - Confirmation Modals -->
    <ComponentShowcase title="AlertDialog - Confirmation Modals"
      description="Modal dialogs for confirming destructive or important actions. Built on top of Modal with pre-styled actions.">
      <template #preview>
        <div class="showcase-actions">
          <Button variant="ghost" @click="showInfoDialog = true">
            Info Dialog
          </Button>
          <Button variant="primary" @click="showSuccessDialog = true">
            Success Dialog
          </Button>
          <Button variant="outline" @click="showWarningDialog = true">
            Warning Dialog
          </Button>
          <Button variant="danger" @click="showDangerDialog = true">
            Danger Dialog
          </Button>
        </div>

        <!-- Dialogs -->
        <AlertDialog :is-open="showInfoDialog" variant="info" title="Information"
          message="This is an informational dialog. No destructive action will occur." confirm-text="Got it"
          @confirm="handleDialogConfirm('Info'); showInfoDialog = false" @cancel="showInfoDialog = false"
          @close="showInfoDialog = false" />

        <AlertDialog :is-open="showSuccessDialog" variant="success" title="Action Completed"
          message="Your action has been completed successfully. Would you like to proceed?" confirm-text="Continue"
          @confirm="handleDialogConfirm('Success'); showSuccessDialog = false" @cancel="showSuccessDialog = false"
          @close="showSuccessDialog = false" />

        <AlertDialog :is-open="showWarningDialog" variant="warning" title="Proceed with Caution"
          message="This action may have unintended consequences. Are you sure you want to continue?"
          confirm-text="Proceed" @confirm="handleDialogConfirm('Warning'); showWarningDialog = false"
          @cancel="showWarningDialog = false" @close="showWarningDialog = false" />

        <AlertDialog :is-open="showDangerDialog" variant="danger" title="Delete Item?"
          message="This action cannot be undone. The item will be permanently deleted from the system."
          confirm-text="Delete" cancel-text="Cancel" @confirm="handleDialogConfirm('Danger'); showDangerDialog = false"
          @cancel="showDangerDialog = false" @close="showDangerDialog = false" />
      </template>

      <template #code>
        <CodeBlock :code="alertDialogExample" language="vue" />
      </template>
    </ComponentShowcase>
  </div>
</template>

<style lang="scss" scoped>
.alerts-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);

  &__header {
    h1 {
      margin: 0 0 var(--spacing-xs);
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .subtitle {
      margin: 0;
      font-size: var(--font-size-md);
      color: var(--color-text-secondary);
      max-width: 800px;
    }
  }
}

.showcase-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.showcase-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.showcase-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-md);
}

.alert-dismissed {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-success);
  font-size: var(--font-size-sm);
  text-align: center;
}
</style>
