export interface UiIcon {
    viewBox: string
    path: string
    label: string
}

/**
 * Interface Icons (UI)
 * Baseado no Material Design Icons (Filled) para consistência visual e legibilidade.
 * Padronizado em viewBox 0 0 24 24.
 */
export const UI_ICONS: Record<string, UiIcon> = {
    // Navigation (Navegação)
    'home': {
        viewBox: '0 0 24 24',
        path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
        label: 'Home'
    },
    'menu': {
        viewBox: '0 0 24 24',
        path: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
        label: 'Menu'
    },
    'settings': {
        viewBox: '0 0 24 24',
        path: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.88l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.18-1.11.5-1.62.88l-2.39-.96a.48.48 0 0 0-.59.22L2.64 9.47a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.88l.36 2.54c.05.24.23.41.47.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.18 1.11-.5 1.62-.88l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
        label: 'Settings'
    },
    'search': {
        viewBox: '0 0 24 24',
        path: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
        label: 'Search'
    },
    'user': {
        viewBox: '0 0 24 24',
        path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
        label: 'User'
    },
    'arrows_horizontal': {
        viewBox: '0 0 24 24',
        path: 'M 2 11 H 16.17 L 10.59 5.41 L 12 4 L 20 12 L 12 20 L 10.59 18.59 L 16.17 13 H 2 Z', // Custom arrow logic? Reverting to standard Swap/Exchange style or directional? Let's use individual arrows.
        label: 'Arrows'
    },

    // Directions (Direcionais)
    'arrow_left': {
        viewBox: '0 0 24 24',
        path: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
        label: 'Arrow Left'
    },
    'arrow_right': {
        viewBox: '0 0 24 24',
        path: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
        label: 'Arrow Right'
    },
    'arrow_up': {
        viewBox: '0 0 24 24',
        path: 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',
        label: 'Arrow Up'
    },
    'arrow_down': {
        viewBox: '0 0 24 24',
        path: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z',
        label: 'Arrow Down'
    },
    'chevron_left': {
        viewBox: '0 0 24 24',
        path: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
        label: 'Chevron Left'
    },
    'chevron_right': {
        viewBox: '0 0 24 24',
        path: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
        label: 'Chevron Right'
    },
    'chevron_up': {
        viewBox: '0 0 24 24',
        path: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
        label: 'Chevron Up'
    },
    'chevron_down': {
        viewBox: '0 0 24 24',
        path: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z',
        label: 'Chevron Down'
    },

    // Actions (Ações)
    'close': {
        viewBox: '0 0 24 24',
        path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
        label: 'Close'
    },
    'check': {
        viewBox: '0 0 24 24',
        path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
        label: 'Check'
    },
    'plus': {
        viewBox: '0 0 24 24',
        path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
        label: 'Add'
    },
    'minus': {
        viewBox: '0 0 24 24',
        path: 'M19 13H5v-2h14v2z',
        label: 'Remove'
    },
    'edit': {
        viewBox: '0 0 24 24',
        path: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
        label: 'Edit'
    },
    'delete': {
        viewBox: '0 0 24 24',
        path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
        label: 'Delete'
    },
    'info': {
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
        label: 'Info'
    },
    'warning': {
        viewBox: '0 0 24 24',
        path: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
        label: 'Warning'
    },
    'circle_check': {
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        label: 'Success'
    },

    // Files & Content
    'file_document': {
        viewBox: '0 0 24 24',
        path: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
        label: 'File'
    },
    'folder': {
        viewBox: '0 0 24 24',
        path: 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
        label: 'Folder'
    },
    'folder_open': {
        viewBox: '0 0 24 24',
        path: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z',
        label: 'Folder Open'
    },
    'save': {
        viewBox: '0 0 24 24',
        path: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z',
        label: 'Save'
    },
    'download': {
        viewBox: '0 0 24 24',
        path: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
        label: 'Download'
    },
    'upload': {
        viewBox: '0 0 24 24',
        path: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z',
        label: 'Upload'
    },
    'cloud_upload': {
        viewBox: '0 0 24 24',
        path: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z',
        label: 'Cloud Upload'
    },
    'print': {
        viewBox: '0 0 24 24',
        path: 'M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v4H8v-4h8zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z',
        label: 'Print'
    },

    // Communication
    'email': {
        viewBox: '0 0 24 24',
        path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
        label: 'Email'
    },
    'send': {
        viewBox: '0 0 24 24',
        path: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z',
        label: 'Send'
    },
    'chat': {
        viewBox: '0 0 24 24',
        path: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
        label: 'Chat'
    },
    'notifications': {
        viewBox: '0 0 24 24',
        path: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
        label: 'Notifications'
    },
    'share': {
        viewBox: '0 0 24 24',
        path: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z',
        label: 'Share'
    },
    'link': {
        viewBox: '0 0 24 24',
        path: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
        label: 'Link'
    },

    // Security
    'lock': {
        viewBox: '0 0 24 24',
        path: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
        label: 'Lock'
    },
    'lock_open': {
        viewBox: '0 0 24 24',
        path: 'M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z',
        label: 'Lock Open'
    },
    'visibility': {
        viewBox: '0 0 24 24',
        path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
        label: 'Visibility'
    },
    'visibility_off': {
        viewBox: '0 0 24 24',
        path: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4.01.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
        label: 'Visibility Off'
    },
    'login': {
        viewBox: '0 0 24 24',
        path: 'M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z',
        label: 'Login'
    },
    'logout': {
        viewBox: '0 0 24 24',
        path: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
        label: 'Logout'
    },

    // Date & Time
    'calendar': {
        viewBox: '0 0 24 24',
        path: 'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
        label: 'Calendar'
    },
    'clock': {
        viewBox: '0 0 24 24',
        path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
        label: 'Clock'
    },

    // System
    'filter_list': {
        viewBox: '0 0 24 24',
        path: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
        label: 'Filter'
    },
    'more_vert': {
        viewBox: '0 0 24 24',
        path: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
        label: 'More Vertical'
    },

    // Media
    'play': {
        viewBox: '0 0 24 24',
        path: 'M8 5v14l11-7z',
        label: 'Play'
    },
    'pause': {
        viewBox: '0 0 24 24',
        path: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
        label: 'Pause'
    },
    'map': {
        viewBox: '0 0 24 24',
        path: 'M20.5 3l-6 1.5-6-1.5L2 6v15l6.5-1.5 6 1.5 6.5-1.5V3zM15 19l-6-1.5V6.5l6 1.5V19z',
        label: 'Map'
    },
    'location': {
        viewBox: '0 0 24 24',
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        label: 'Location'
    }
}

export type UiIconName = keyof typeof UI_ICONS
