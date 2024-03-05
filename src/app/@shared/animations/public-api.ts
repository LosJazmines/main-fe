import { expandCollapse } from './expand-collapse';
import { fadeIn, fadeInBottom, fadeInLeft, fadeInOutInsideCollapsed, fadeInRight, fadeInTop, fadeOut, fadeOutBottom, fadeOutLeft, fadeOutRight, fadeOutTop } from './fade';
import { shake } from './shake';
import { slideInBottom, slideInLeft, slideInRight, slideInTop, slideOutBottom, slideOutLeft, slideOutRight, slideOutTop } from './slide';
import { zoomIn, zoomOut } from './zoom';

export const Animations = [
    expandCollapse,
    shake,
    slideInTop, slideInBottom, slideInLeft, slideInRight,
    slideOutTop, slideOutBottom, slideOutLeft, slideOutRight,
    zoomIn, zoomOut,
    fadeIn, fadeInTop, fadeInBottom, fadeInLeft, fadeInRight,
    fadeOut, fadeOutTop, fadeOutBottom, fadeOutLeft, fadeOutRight, fadeInOutInsideCollapsed
];
