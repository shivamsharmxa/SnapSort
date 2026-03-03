/**
 * AppRedesign - Entry point for new macOS-native UI
 * Import this instead of App.tsx to use the redesigned interface
 */

import AppLayout from './components/redesign/AppLayout';
import './index.css';

export default function AppRedesign() {
  return <AppLayout />;
}
