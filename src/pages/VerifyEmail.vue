<template>
	<div class="bg-slate-100 dark:bg-slate-900 font-sans min-h-screen flex items-center justify-center p-4" v-cloak>
		<div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out" :class="{ 'shadow-2xl scale-105': isLoading }">
			<!-- Header -->
			<div class="p-6 pb-0">
				<div class="text-center mb-6">
					<h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">BETAPAK</h1>
					<p class="text-slate-500 dark:text-slate-400 mt-2">Email Doğrulama</p>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="isLoading && !showPasswordForm" class="p-6">
				<div class="text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
					<p class="text-slate-600 dark:text-slate-400">Email doğrulanıyor...</p>
				</div>
			</div>

			<!-- Password Reset Form -->
			<div v-if="showPasswordForm" class="p-6">
				<div class="mb-6">
					<div class="flex items-center justify-center mb-4">
						<div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
							<svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
						</div>
					</div>
					<h2 class="text-lg font-semibold text-center text-slate-800 dark:text-slate-200 mb-2">Email Doğrulandı</h2>
					<p class="text-center text-slate-600 dark:text-slate-400">Yeni şifrenizi belirleyin</p>
				</div>

				<form @submit.prevent="handlePasswordReset" class="space-y-5">
					<!-- New Password Input -->
					<div>
						<label for="newPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yeni Şifre</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
							</div>
							<input id="newPassword" v-model="newPassword" type="password" required :disabled="isLoading" class="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="••••••••" />
						</div>
						<p v-if="formErrors.newPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.newPassword }}</p>
					</div>

					<!-- Confirm Password Input -->
					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Şifre Tekrarı</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
							</div>
							<input id="confirmPassword" v-model="confirmPassword" type="password" required :disabled="isLoading" class="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="••••••••" />
						</div>
						<p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.confirmPassword }}</p>
					</div>

					<!-- Reset Button -->
					<div>
						<button type="submit" :disabled="isLoading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70 dark:bg-indigo-700 dark:hover:bg-indigo-600">
							<span v-if="isLoading" class="flex items-center">
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
								Şifre güncelleniyor...
							</span>
							<span v-else>Şifreyi Güncelle</span>
						</button>
					</div>
				</form>
			</div>

			<!-- Error Message -->
			<div v-if="errorMessage" class="px-6 pb-6">
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm" role="alert">{{ errorMessage }}</div>
			</div>

			<!-- Success Message -->
			<div v-if="successMessage" class="px-6 pb-6">
				<div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm" role="alert">{{ successMessage }}</div>
			</div>

			<!-- Theme Toggle -->
			<div class="flex justify-center pb-4">
				<button @click="toggleTheme" class="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
					<svg v-if="isDarkMode" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
					<svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthService } from '@/services/api'

export default {
	name: 'VerifyEmail',
	setup() {
		const router = useRouter()
		const route = useRoute()

		const email = ref('')
		const token = ref('')
		const newPassword = ref('')
		const confirmPassword = ref('')
		const isLoading = ref(false)
		const errorMessage = ref('')
		const successMessage = ref('')
		const showPasswordForm = ref(false)
		const isDarkMode = ref(localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches))

		const applyTheme = () => { if (isDarkMode.value) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark') }
		const toggleTheme = () => { isDarkMode.value = !isDarkMode.value; localStorage.setItem('darkMode', isDarkMode.value); applyTheme() }

		const formErrors = reactive({ newPassword: '', confirmPassword: '' })

		const extractParams = () => {
			email.value = route.query.email || ''
			token.value = route.query.token || ''
			if (!email.value || !token.value) {
				errorMessage.value = 'Geçersiz doğrulama linki.'
				setTimeout(() => { router.replace('/login') }, 2000)
				return false
			}
			return true
		}

		const verifyEmailToken = async () => {
			if (!extractParams()) return
			isLoading.value = true
			errorMessage.value = ''
			try {
				const response = await AuthService.verifyPasswordToken(email.value, token.value)
				if (response?.isValid === true) showPasswordForm.value = true
				else {
					errorMessage.value = 'Geçersiz veya süresi dolmuş doğrulama linki.'
					setTimeout(() => { router.replace('/login') }, 3000)
				}
			} catch (e) {
				console.error('Token verification error:', e)
				errorMessage.value = 'Doğrulama sırasında bir hata oluştu.'
				setTimeout(() => { router.replace('/login') }, 3000)
			} finally {
				isLoading.value = false
			}
		}

		const validatePasswordForm = () => {
			let valid = true
			formErrors.newPassword = ''
			formErrors.confirmPassword = ''
			errorMessage.value = ''
			if (!newPassword.value) { formErrors.newPassword = 'Yeni şifre gereklidir'; valid = false }
			else if (newPassword.value.length < 6) { formErrors.newPassword = 'Şifre en az 6 karakter olmalıdır'; valid = false }
			if (!confirmPassword.value) { formErrors.confirmPassword = 'Şifre tekrarı gereklidir'; valid = false }
			else if (newPassword.value !== confirmPassword.value) { formErrors.confirmPassword = 'Şifreler eşleşmiyor'; valid = false }
			return valid
		}

		const handlePasswordReset = async () => {
			if (!validatePasswordForm()) return
			isLoading.value = true
			successMessage.value = ''
			errorMessage.value = ''
			try {
				await AuthService.resetPassword(email.value, token.value, newPassword.value)
				successMessage.value = 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...'
				setTimeout(() => { router.replace('/login') }, 2000)
			} catch (e) {
				console.error('Password reset error:', e)
				errorMessage.value = e?.response?.data?.message || 'Şifre güncellenirken bir hata oluştu.'
			} finally {
				isLoading.value = false
			}
		}

		onMounted(() => { applyTheme(); verifyEmailToken() })

		return { isLoading, showPasswordForm, newPassword, confirmPassword, formErrors, handlePasswordReset, errorMessage, successMessage, isDarkMode, toggleTheme }
	}
}
</script>


