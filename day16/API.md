/**
 * Canvas Editor API Documentation
 * 
 * Main Endpoints:
 * GET / - Renders the main canvas editor page
 * 
 * Canvas Operations:
 * - Add Text: Creates a new text element on the canvas
 * - Add Image: Adds an image from the Picsum API to the canvas
 * - Change Background: Updates the canvas background color
 * - Download: Exports the canvas as a PNG file
 * 
 * Error Responses:
 * 500 Internal Server Error:
 * {
 *   "error": true,
 *   "message": "Internal Server Error",
 *   "details": "Error details (in development mode only)"
 * }
 * 
 * Client-side Validation:
 * - Image URLs must match Picsum format
 * - Font sizes must be between 1-200px
 * - Colors must be valid hex codes
 */
