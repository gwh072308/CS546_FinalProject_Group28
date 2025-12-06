import { Router } from "express";
const router = Router();
import {
  getAllArrests,
  getArrestById,
  getArrestsByFilter,
  searchArrests
} from "../data/arrests.js";
import { checkString, checkId } from "../data/utils.js";


router.get("/", async (req, res) => {
  try {
    const arrests = await getAllArrests();
    return res.render("arrestList", { arrests });
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router.get("/search", async (req, res) => {
  let { keyword } = req.query;

  if (!keyword) {
    return res.render("search", { showForm: true });
  }

  try {
    keyword = checkString(keyword, "keyword");
    const results = await searchArrests(keyword);
    return res.render("search", {
      showForm: true,
      results,
      keyword
    });
  } catch (e) {
    return res.render("search", { showForm: true, error: e });
  }
});

router.get("/filter", async (req, res) => {
  const filters = req.query;

  if (Object.keys(filters).length === 0) {
    return res.render("filter");
  }

  try {
    const results = await getArrestsByFilter(filters);
    return res.render("filter", { arrests: results });
  } catch (e) {
    return res.render("error", { error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = checkId(req.params.id, "id");
    const arrest = await getArrestById(id);
    return res.render("arrestDetails", { arrest });
  } catch (e) {
    return res.status(404).render("error", { error: e });
  }
});

export default router;