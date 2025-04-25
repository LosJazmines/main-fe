export interface MenuItem {
    label: string;
    icon: string;
    route: string;
    roles?: string[]; // roles permitidos, opcional
}