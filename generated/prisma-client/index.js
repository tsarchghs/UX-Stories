"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Platform",
    embedded: false
  },
  {
    name: "AccountType",
    embedded: false
  },
  {
    name: "File",
    embedded: false
  },
  {
    name: "Video",
    embedded: false
  },
  {
    name: "Job",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "AppVersion",
    embedded: false
  },
  {
    name: "AppCategory",
    embedded: false
  },
  {
    name: "StoryCategory",
    embedded: false
  },
  {
    name: "StoryElement",
    embedded: false
  },
  {
    name: "App",
    embedded: false
  },
  {
    name: "Story",
    embedded: false
  },
  {
    name: "Library",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466/`
});
exports.prisma = new exports.Prisma();
