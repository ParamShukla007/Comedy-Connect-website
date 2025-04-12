// Sample events data (combine featured and near you events)
import img_big from "../assets/img_big.webp";
import img_big2 from "../assets/img_big2.jpg";
import img_big3 from "../assets/img_big3.jpg";

const events = [
  {
    id: 1,
    title: "Satire Special",
    comedian: "Vir Das",
    price: "₹499",
    date: "2023-10-25T00:00:00",
    venue: "Aspee Auditorium",
    genre: "Satire",
    location: "Mumbai",
    image: img_big,
  },
  {
    id: 2,
    title: "Roast Battle",
    comedian: "Kaneez Surka",
    price: "₹699",
    date: "2023-10-28T00:00:00",
    venue: "DJ Sanghvi",
    genre: "Roast Battles",
    location: "Delhi",
    image: img_big2,
  },
  {
    id: 3,
    title: "Improv Jam",
    comedian: "Kenny Sebastian",
    price: "₹399",
    date: "2023-11-02T00:00:00",
    venue: "The Habitat",
    genre: "Improvisational",
    location: "Bangalore",
    image: img_big3,
  },
  {
    id: 4,
    title: "Local Laughs",
    location: "Mumbai",
    date: "2023-10-26T00:00:00",
    price: "₹299",
    venue: "Aspee Auditorium",
    genre: "Sketch Comedy",
    image: img_big,
  },
  {
    id: 5,
    title: "Neighborhood Giggle",
    location: "Pune",
    date: "2023-10-27T00:00:00",
    price: "₹399",
    venue: "Aspee Auditorium",
    genre: "Musical Comedy",
    image: img_big2,
  },
  {
    id: 6,
    title: "Hometown Humor",
    location: "Bangalore",
    date: "2023-10-28T00:00:00",
    price: "₹499",
    venue: "Aspee Auditorium",
    genre: "Dark Comedy",
    image: img_big3,
  },
];

export default events;
