const express = require("express");
const { ObjectId } = require("mongodb");

const dbo = require("../db/Connection");
const { query } = require("../db/Utils");

const projectRouter = express.Router();
const collection = "projects"

const isValidCode = (code) => {
  return code != null && code != "" && code != undefined
}
const calculateOneProgress = (segmented_data, userName) => {
  const containUserCodeLength = segmented_data.map(data => data.codes).flat(2).filter(obj => obj.author == userName && isValidCode(obj.code)).length
  return Math.round(containUserCodeLength / segmented_data.length * 1000) / 10
}

const calculateAllProgress = (segmented_data, coders) => {
  const progressList = {}
  coders.forEach(coder => {
    progressList[coder.name] = calculateOneProgress(segmented_data, coder.name)
  });
  return progressList
}

projectRouter.route("/:owner/:project").get(function (req, res) {
  let myDb = dbo.getDb();
  let filter = { name: req.params.project, owner: req.params.owner }
  query(myDb, collection, filter).then(value => {
    let project = value[0]
    let allProgress = calculateAllProgress(project.segmented_data, project.coders)
    res.json([project, allProgress])
    res.end()
  })
    .catch(err => {
      res.json({})
      res.end()
      console.log(err)
    })
});

const deleteProjectByFilter = (filter, res) => {
  const coll = dbo.getDb().collection(collection);
  coll.deleteOne(filter)
    .then(result => {
      if (result.deletedCount === 1) {
        res.json(result)
        console.log(`Deleted ${result.deletedCount} item.`)
      } else {
        res.status(404).json({ message: "Project not found.", deletedCount: 0 })
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
      console.error(`Delete failed with error: ${err}`)
    })
}

// DELETE /project/:owner?name=... — supports empty name (?name=)
projectRouter.route("/:owner").delete(async function (req, res) {
  const owner = decodeURIComponent(req.params.owner || "")
  if (!owner) {
    return res.status(400).json({ message: "Owner is required." })
  }
  if (req.query.id) {
    try {
      return deleteProjectByFilter({ _id: new ObjectId(req.query.id), owner }, res)
    } catch (err) {
      return res.status(400).json({ message: "Invalid project id." })
    }
  }
  if (req.query.name === undefined) {
    return res.status(400).json({ message: "Query param 'name' or 'id' is required." })
  }
  deleteProjectByFilter({ owner, name: String(req.query.name) }, res)
});

projectRouter.route("/:owner/:project").delete(async function (req, res) {
  const owner = decodeURIComponent(req.params.owner || "")
  const name = decodeURIComponent(req.params.project || "")
  if (!owner || !name) {
    return res.status(400).json({ message: "Owner and project name are required." })
  }
  deleteProjectByFilter({ name, owner }, res)
});

module.exports = projectRouter;