import { Router } from "express";
import {
    createBrandCtrl,
    getAllBrandsCtrl,
    getSingleBrandCtrl,
    updateBrandCtrl,
    deleteBrandCtrl
} from "../controllers/brand.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"

const brandsRouter = Router();

brandsRouter.post("/", isLoggedIn, createBrandCtrl);
brandsRouter.get("/", getAllBrandsCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.put("/:id", isLoggedIn, updateBrandCtrl);
brandsRouter.delete("/:id/delete", isLoggedIn, deleteBrandCtrl);

export default brandsRouter;
