import * as ts from 'typescript';

import { a } from './a';
import { area } from './area';
import { article } from './article';
import { aside } from './aside';
import { body } from './body';
import { button } from './button';
import { datalist } from './datalist';
import { dd } from './dd';
import { details } from './details';
import { dialog } from './dialog';
import { dl } from './dl';
import { dt } from './dt';
import { footer } from './footer';
import { form } from './form';
import { h1 } from './h1';
import { h2 } from './h2';
import { h3 } from './h3';
import { h4 } from './h4';
import { h5 } from './h5';
import { h6 } from './h6';
import { header } from './header';
import { hr } from './hr';
import { img } from './img';
import { input } from './input';
import { li } from './li';
import { link } from './link';
import { main } from './main';
import { math } from './math';
import { menu } from './menu';
import { menuitem } from './menuitem';
import { meter } from './meter';
import { nav } from './nav';
import { ol } from './ol';
import { optgroup } from './optgroup';
import { option } from './option';
import { output } from './output';
import { progress } from './progress';
import { section } from './section';
import { select } from './select';
import { summary } from './summary';
import { table } from './table';
import { tbody } from './tbody';
import { td } from './td';
import { textarea } from './textarea';
import { tfoot } from './tfoot';
import { th } from './th';
import { thead } from './thead';
import { tr } from './tr';
import { ul } from './ul';

export interface IImplicitRoles {
    [i: string]: (node: ts.Node) => string | undefined;
}

/**
 * Export function for getting implicit role based on tag name.
 */
export const implicitRoles: IImplicitRoles = {
    a,
    area,
    article,
    aside,
    body,
    button,
    datalist,
    dd,
    details,
    dialog,
    dl,
    dt,
    footer,
    form,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    header,
    hr,
    img,
    input,
    li,
    link,
    main,
    math,
    menu,
    menuitem,
    meter,
    nav,
    ol,
    optgroup,
    option,
    output,
    progress,
    section,
    select,
    summary,
    table,
    tbody,
    td,
    textarea,
    tfoot,
    th,
    thead,
    tr,
    ul
};
