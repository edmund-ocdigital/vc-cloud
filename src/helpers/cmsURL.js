//====================
// CMS ROUTES
//====================

import {customerListPage} from "./crmURL";

/**
 * Car Pages
 */
export const carPage = "/app/cms/car";

export const carNewPage = `${carPage}/new`;
export const singleCar = id => `${carPage}/${id}`;

/**
 * Blog Pages
 */
export const blogPage = "/app/cms/blog";
export const blogNewPage = `${blogPage}/new`;
export const singleBlog = id => `${blogPage}/${id}`;