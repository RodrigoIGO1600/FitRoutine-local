"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIdParam = parseIdParam;
function parseIdParam(value) {
    if (typeof value !== "string") {
        return null;
    }
    const id = value.trim();
    if (!id) {
        return null;
    }
    return id;
}
