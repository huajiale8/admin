interface EditType {
    component: String;
    created_at: String;
    expanded: Boolean;
    hasChildren: Boolean;
    icon: String;
    id: Number;
    is_show: Number;
    level: Number;
    order: String;
    pid: Number;
    sort: Number;
    status: Number;
    tips: null | String;
    title: String;
    type: String;
    updated_at: String;
    url: String;
}

interface OptionsType {
    children?: OptionsType[]
    component: string
    expanded?: boolean
    id: number
    icon: string
    is_show: number
    level: number
    order: string
    pid: number
    sort: number
    status: number
    tips: string | null
    title: string
    type: string
    leaf?: boolean,
    url: string
}

interface EditArea {
    add_title: string;
    can_add: boolean;
    children2?: EditArea[];
    created_at?: string;
    hasChildren: boolean;
    id: number;
    is_edit: boolean;
    level: number;
    name: string;
    pid: number;
    status: number;
    updated_at: string;
}

interface Area {
    add_title: string;
    can_add: boolean;
    children?: Area[];
    is_edit: boolean;
    id: number;
    name: string;
    hasChildren?: boolean;
    children2?: Area[];
    level: number;
    pid: number;
}

interface Tree {
    name: string;
}

