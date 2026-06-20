"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const exercise_routes_js_1 = require("./routes/exercise.routes.js");
const routine_routes_js_1 = require("./routes/routine.routes.js");
const routine_exercise_routes_js_1 = require("./routes/routine-exercise.routes.js");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "FitRoutine API is running"
    });
});
exports.app.use("/api/exercises", exercise_routes_js_1.exerciseRoutes);
exports.app.use("/api/routines", routine_routes_js_1.routineRoutes);
exports.app.use("/api", routine_exercise_routes_js_1.routineExerciseRoutes);
