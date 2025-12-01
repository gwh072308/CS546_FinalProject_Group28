import { ObjectId } from "mongodb";
import { arrests } from "../config/mongoCollections.js";
import {
  checkId,
  checkString,
  checkNumber,
} from "../data/utils.js";

const createArrest = async (
  arrest_date,
  borough,
  precinct,
  offense_description,
  law_category,
  age_group,
  gender,
  race,
  latitude,
  longitude
) => {
  if (
    !arrest_date ||
    !borough ||
    precinct === undefined ||
    !offense_description ||
    !law_category ||
    !age_group ||
    !gender ||
    !race
  )
    throw "Error: all fields must be provided";

  arrest_date = checkString(arrest_date, "arrest_date");

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(arrest_date)) {
    throw "Error: arrest_date must be in YYYY-MM-DD format";
  }

  const dateObj = new Date(arrest_date);

  if (isNaN(dateObj.getTime())) {
    throw "Error: arrest_date is not a valid date";
  }

  const today = new Date();
  if (dateObj > today) {
    throw "Error: arrest_date cannot be in the future";
  }

  borough = checkString(borough, "borough");
  const validBoroughs = ["B", "S", "K", "M", "Q"];
  if (!validBoroughs.includes(borough.toUpperCase())) {
    throw "Error: borough must be one of B, S, K, M, Q";
  }

  offense_description = checkString(offense_description, "offense_description");

  law_category = checkString(law_category, "law_category");
  const validLevels = ["felony", "misdemeanor", "violation"];
  if (!validLevels.includes(law_category.toLowerCase())) {
    throw "Error: law_category must be felony, misdemeanor, or violation";
  }

  age_group = checkString(age_group, "age_group");

  const validAgeGroups = ["<18", "18-24", "25-44", "45-64", "65+", "null"];
  if (!validAgeGroups.includes(age_group)) {
    throw "Error: age_group must be one of <18, 18-24, 25-44, 45-64, 65+, null";
  }

  race = checkString(race, "race");
  const validRaces = [
    "WHITE",
    "WHITE HISPANIC",
    "BLACK",
    "BLACK HISPANIC",
    "ASIAN / PACIFIC ISLANDER",
    "AMERICAN INDIAN / ALASKAN NATIVE",
    "UNKNOWN"
  ];

  if (!validRaces.includes(race.toUpperCase())) {
    throw "Error: invalid race value";
  }

  precinct = checkNumber(precinct, "precinct");
  if (precinct < 1 || precinct > 123) {
    throw "Error: precinct must be a valid precinct number (1-123)";
  }

  gender = checkString(gender, "gender");
  const validGenders = ["M", "F", "U"];
  if (!validGenders.includes(gender.toUpperCase())) {
    throw "Error: gender must be 'M', 'F', or 'U'";
  }

  if (latitude !== undefined && latitude !== null) {
    latitude = checkNumber(latitude, "latitude");
    if (latitude < -90 || latitude > 90) throw "Error: invalid latitude";
  } else latitude = null;

  if (longitude !== undefined && longitude !== null) {
    longitude = checkNumber(longitude, "longitude");
    if (longitude < -180 || longitude > 180) throw "Error: invalid longitude";
  } else longitude = null;

  const arrestCollection = await arrests();

  const newArrest = {
    _id: new ObjectId(),
    arrest_date,
    borough,
    precinct,
    offense_description,
    law_category,
    age_group,
    gender,
    race,
    arrest_location: {
      latitude,
      longitude
    }
  };

  const insertInfo = await arrestCollection.insertOne(newArrest);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: could not add arrest record";

  const inserted = await arrestCollection.findOne({
    _id: insertInfo.insertedId
  });

  inserted._id = inserted._id.toString();
  return inserted;
};

const getAllArrests = async () => {
  const arrestCollection = await arrests();
  const all = await arrestCollection.find({}).toArray();

  if (!all || all.length === 0) return [];

  return all.map((a) => {
    a._id = a._id.toString();
    return a;
  });
};

const getArrestById = async (id) => {
  id = checkId(id, "id");

  const arrestCollection = await arrests();
  const arrest = await arrestCollection.findOne({ _id: new ObjectId(id) });

  if (!arrest) throw "Error: no arrest found with the given id";

  arrest._id = arrest._id.toString();
  return arrest;
};

const removeArrest = async (id) => {
  id = checkId(id, "id");

  const arrestCollection = await arrests();
  const deletionInfo = await arrestCollection.deleteOne({
    _id: new ObjectId(id)
  });

  if (deletionInfo.deletedCount === 0)
    throw `Error: could not delete arrest with id of ${id}`;

  return { deleted: true };
};

const getArrestsByFilter = async (filters = {}) => {
  const arrestCollection = await arrests();
  const query = {};

  if (filters.borough) query.borough = checkString(filters.borough, "borough");
  if (filters.precinct !== undefined && filters.precinct !== "") {
    const p = Number(filters.precinct);
    if (isNaN(p) || p < 1 || p > 123) throw "Invalid precinct";
    query.precinct = p;
  }
  if (filters.offense_description)
    query.offense_description = checkString(filters.offense_description, "offense_description");
  if (filters.law_category)
    query.law_category = checkString(filters.law_category, "law_category");
  if (filters.age_group)
    query.age_group = checkString(filters.age_group, "age_group");
  if (filters.gender)
    query.gender = checkString(filters.gender, "gender");
  if (filters.race)
    query.race = checkString(filters.race, "race");

  const results = await arrestCollection.find(query).toArray();
  return results.map((a) => ({ ...a, _id: a._id.toString() }));
};

const searchArrests = async (keyword) => {
  keyword = checkString(keyword, "keyword");
  const arrestCollection = await arrests();

  const results = await arrestCollection
    .find({
      $or: [
        { offense_description: { $regex: keyword, $options: "i" } },
        { law_category: { $regex: keyword, $options: "i" } }
      ]
    })
    .toArray();

  return results.map((a) => ({ ...a, _id: a._id.toString() }));
};

export {
  createArrest,
  getAllArrests,
  getArrestById,
  removeArrest,
  getArrestsByFilter,
  searchArrests
};