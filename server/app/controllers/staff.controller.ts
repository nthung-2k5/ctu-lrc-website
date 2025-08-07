import { createBaseController } from './base.controller.js';
import staffService from '#services/staff.service.js';

// Create base controller functions
export default createBaseController(staffService);
