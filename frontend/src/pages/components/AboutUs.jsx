import React from 'react';
import { Coffee, Bean, Award, Users, Clock, MapPin } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Master Roaster",
      image: "/api/placeholder/128/128",
      description: "With 15 years of experience in coffee roasting, Sarah ensures every bean meets our premium standards."
    },
    {
      name: "Michael Chen",
      role: "Head Barista",
      image: "/api/placeholder/128/128",
      description: "A certified Q-grader with passion for creating the perfect cup of coffee every time."
    },
    {
      name: "Emma Garcia",
      role: "Coffee Sourcing Director",
      image: "/api/placeholder/128/128",
      description: "Travels the world to build lasting relationships with our coffee farmers and cooperatives."
    },
    {
      name: "David Wilson",
      role: "Café Operations Manager",
      image: "/api/placeholder/128/128",
      description: "Ensures every customer experiences the warmth and quality we're known for."
    }
  ];

  const values = [
    {
      icon: <Bean className="w-8 h-8" />,
      title: "Quality First",
      description: "We source only the finest single-origin beans and create unique artisanal blends."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Focus",
      description: "Supporting local communities and building lasting relationships with our farmers."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Artisanal Craft",
      description: "Every batch is roasted with precision and care in our small-batch roastery."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#2C1810]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#E6B17E]">
              Our Coffee Story
            </h1>
            <p className="text-xl text-[#D4C3B9] max-w-2xl mb-8">
              Since 2010, we've been crafting exceptional coffee experiences, 
              bringing the finest beans from around the world to your cup.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-[#2C1810]">Our Heritage</h2>
              <p className="text-lg text-[#5C4D44] mb-6">
                Our journey began in a small roastery with a simple mission: to share 
                our passion for exceptional coffee with the world. Today, we continue 
                to roast our beans with the same dedication and care that defined our 
                earliest days.
              </p>
              <p className="text-lg text-[#5C4D44]">
                Every cup we serve is a testament to our commitment to quality, 
                sustainability, and the art of coffee making. We work directly with 
                farmers to ensure fair practices and superior beans.
              </p>
            </div>
            <div className="flex-1">
              <img 
                src="/api/placeholder/600/400" 
                alt="Our Roastery" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#2C1810]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#E6B17E]">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-[#3D261C] p-8 rounded-lg text-center">
                <div className="flex justify-center mb-4 text-[#E6B17E]">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#E6B17E]">
                  {value.title}
                </h3>
                <p className="text-[#D4C3B9]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#2C1810]">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2 text-[#2C1810]">
                  {member.name}
                </h3>
                <p className="text-[#5C4D44] font-medium mb-4">{member.role}</p>
                <p className="text-[#5C4D44] text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#2C1810]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Coffee className="w-8 h-8 mx-auto mb-4 text-[#E6B17E]" />
              <h3 className="text-3xl font-bold mb-2 text-[#E6B17E]">50K+</h3>
              <p className="text-[#D4C3B9]">Cups Served Daily</p>
            </div>
            <div>
              <Bean className="w-8 h-8 mx-auto mb-4 text-[#E6B17E]" />
              <h3 className="text-3xl font-bold mb-2 text-[#E6B17E]">15+</h3>
              <p className="text-[#D4C3B9]">Coffee Origins</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 mx-auto mb-4 text-[#E6B17E]" />
              <h3 className="text-3xl font-bold mb-2 text-[#E6B17E]">12</h3>
              <p className="text-[#D4C3B9]">Locations</p>
            </div>
            <div>
              <Clock className="w-8 h-8 mx-auto mb-4 text-[#E6B17E]" />
              <h3 className="text-3xl font-bold mb-2 text-[#E6B17E]">13</h3>
              <p className="text-[#D4C3B9]">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;