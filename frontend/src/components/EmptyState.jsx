import { Users } from "lucide-react";

const EmptyState = ({ icon: Icon = Users, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-4">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
