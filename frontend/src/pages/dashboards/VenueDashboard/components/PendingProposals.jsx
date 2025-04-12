import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PropTypes from 'prop-types';

const PendingProposals = ({ proposals }) => {
  return (
      <Card className="glass-card md:col-span-2">
              <CardHeader>
                <CardTitle>Pending Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proposals.map((proposal, index) => (
                    <div key={index} className="relative group h-[300px] rounded-xl overflow-hidden">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={proposal.comedian.image} 
                          alt={proposal.comedian.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
                      </div>
                      
                      {/* Content */}
                      <div className="relative h-full p-6 flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-primary">
                            <AvatarImage src={proposal.comedian.image} />
                          </Avatar>
                          <div>
                            <h3 className="text-white font-semibold">{proposal.comedian.name}</h3>
                            <p className="text-white/80 text-sm">⭐ {proposal.comedian.rating}</p>
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div>
                          <h4 className="text-white text-xl font-bold mb-2">{proposal.show}</h4>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{proposal.status}</Badge>
                            <p className="text-white/80 text-sm">{proposal.date}</p>
                          </div>
                          <button className="w-full mt-4 bg-primary/90 hover:bg-primary text-black font-medium py-2 rounded-lg transition-colors">
                            Review Proposal
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
  );
};

PendingProposals.propTypes = {
  proposals: PropTypes.array.isRequired
};

export default PendingProposals;
