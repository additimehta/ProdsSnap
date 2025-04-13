
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Sliders } from 'lucide-react';

const Settings = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <SettingsIcon className="h-16 w-16 text-primary opacity-50 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          This feature will be implemented in a future update. Configure your application preferences here.
        </p>
        <Button variant="outline" className="gap-2">
          <Sliders className="h-4 w-4" />
          Coming Soon
        </Button>
      </div>
    </PageLayout>
  );
};

export default Settings;
