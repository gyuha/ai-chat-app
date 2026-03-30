import { createFileRoute } from '@tanstack/react-router';

import { SettingsPanelPlaceholder } from '@/components/settings/settings-panel-placeholder';

export const Route = createFileRoute('/settings')({
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsPanelPlaceholder />;
}
