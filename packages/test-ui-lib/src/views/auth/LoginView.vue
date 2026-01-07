<script setup lang="ts">
import { Btn, Input } from '@lugand/vue-ui-lib'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
    console.log('Login attempt:', { email: email.value, password: password.value })
}
</script>

<template>
    <div class="login-view">
        <div class="login-card">
            <h2>Login Scenario</h2>
            <p class="subtitle">Testing Input and Btn integration</p>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <Input v-model="email" label="Email" placeholder="user@example.com" type="email" />
                </div>

                <div class="form-group">
                    <Input v-model="password" label="Password" placeholder="••••••••" type="password" />
                </div>

                <div class="form-actions">
                    <Btn type="submit" variant="primary" class="full-width">Sign In</Btn>
                    <Btn variant="ghost" class="full-width">Forgot Password?</Btn>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.login-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
}

.login-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-primary);
}

.subtitle {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.full-width {
    width: 100%;
}
</style>
