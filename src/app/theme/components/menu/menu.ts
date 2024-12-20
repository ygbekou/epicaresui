import { Menu } from './menu.model';

export const horizontalMenuItems = [
    new Menu (1, 'Accueil', '/', null, null, false, 0),

    new Menu(20, 'Nos Services', null, null, null, true, 0),

    new Menu (30, 'A Propos de nous', '/about', null, null, false, 0),

    new Menu (40, 'Media', '/blogs', null, null, false, 0),

    new Menu (50, 'Contact', '/contact', null, null, false, 0),

    new Menu (60, 'FAQ', '/faq', null, null, false, 0)
]

export const verticalMenuItems = [
    new Menu (1, 'Accueil', '/', null, null, false, 0),

    new Menu(20, 'Nos Services', null, null, null, true, 0),

    new Menu (30, 'A Propos de nous', '/about', null, null, false, 0),

    new Menu (40, 'Media', '/blogs', null, null, false, 0),

    new Menu (50, 'Contact', '/contact', null, null, false, 0),

    new Menu (60, 'FAQ', '/faq', null, null, false, 0)
]