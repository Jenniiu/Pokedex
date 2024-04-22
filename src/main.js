import { createApp } from 'vue'
import App from './App.vue'
import "@fontsource/poppins"
import { createI18n } from 'vue-i18n';

import {pt_br} from '../src/locales/pt_br';
import {en} from '../src/locales/en';
import {es} from '../src/locales/es';

const lenguages = {
    pt_br,
    en,
    es
};

const i18n = createI18n({
    locale: 'es',
    fallbackLocale: 'es',
    messages: lenguages,
});

createApp(App).use(i18n).mount('#app')
