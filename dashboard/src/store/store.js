import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import projectReducer from './projectSlice.js';
import skillReducer from './skillSlice.js';
import timelineReducer from './timelineSlice.js';
import softwareReducer from './softwareSlice.js';
import messageReducer from './messageSlice.js';
import resumeReducer from './resumeSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectReducer,
    skills: skillReducer,
    timeline: timelineReducer,
    software: softwareReducer,
    messages: messageReducer,
    resume: resumeReducer,
  },
});

