import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PropTypes from 'prop-types';

const UpcomingShows = ({ shows }) => {
  return (
    <Card className="glass-card md:col-span-3">
    <CardHeader>
      <CardTitle>Upcoming Shows</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shows.map((show, index) => (
          <div key={index} className="show-card relative group h-[300px] rounded-xl overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={show.comedian.image} 
                alt={show.comedian.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
            </div>
            
            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary">
                  <AvatarImage src={show.comedian.image} />
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold">{show.comedian.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">⭐ {show.comedian.rating}</span>
                    <span className="text-white/60 text-sm">{show.comedian.followers} followers</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div>
                <h4 className="text-white text-xl font-bold mb-2">{show.title}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>{show.date} • {show.time}</span>
                    <span>{show.tickets.price}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Tickets sold</span>
                      <span>{show.tickets.sold}/{show.tickets.total}</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${(show.tickets.sold / show.tickets.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  );
};

UpcomingShows.propTypes = {
  shows: PropTypes.array.isRequired
};

export default UpcomingShows;
