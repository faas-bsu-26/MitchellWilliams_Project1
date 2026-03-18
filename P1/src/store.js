import { reactive } from "vue";
import bird from './assets/bird.jpeg'
import rain from './assets/rain.jpg'
import city from './assets/city.jpg'

export const store = reactive({
  activeTab: "Explore",
  myPosts: [],
  explorePosts: [
    {
      id: 1,
      author: "Sarah K.",
      title: "Birds at Red Rock Canyon",
      location: "Nevada, USA",
      date: "Mar 12, 2025",
      description: "Birds chirping at golden hour.",
      tags: ["nature", "birds"],
      likes: 42,
      comments: 8,
      liked: false,
      audioUrl: "assets/ambulance.mp3",
      photoPreview: bird,
    },
    {
      id: 2,
      author: "James T.",
      title: "Downtown Echo",
      location: "Chicago, IL",
      date: "Feb 28, 2025",
      description: "Urban soundscape from the river walk.",
      tags: ["urban", "ambient"],
      likes: 27,
      comments: 3,
      liked: false,
      audioUrl: "assets/ambulance.mp3",
      photoPreview: city,
    },
    {
      id: 3,
      author: "Priya M.",
      title: "Rainy Morning",
      location: "Olympic Natl. Park",
      date: "Jan 15, 2025",
      description: "Rain falling on leaves.",
      tags: ["rain", "nature"],
      likes: 89,
      comments: 14,
      liked: false,
      audioUrl: "assets/ambulance.mp3",
      photoPreview: rain,
    },
  ],
  communityProjects: [
    {
      id: 1,
      author: "Sarah K.",
      title: "Replay",
      description: "A short film about someone reliving the same 30 seconds over and over, trying to fix one mistake.",
      tags: ["sfx", "film"],
      likes: 54,
      comments: 11,
      liked: false,
      audioUrl: null,
      photoPreview: null,
      sourceSounds: [
        { label: "Rainy Morning", fileName: "rain.wav", audioUrl: null },
      ],
    },
    {
      id: 2,
      author: "James T.",
      title: "City beat",
      description: "Hiphop beat sampling sounds of major cities.",
      tags: ["hiphop", "beat"],
      likes: 38,
      comments: 6,
      liked: false,
      audioUrl: "assets/ambulance.mp3",
      photoPreview: null,
      sourceSounds: [
        { label: "Chicago rush", fileName: "chicago.wav", audioUrl: null },
        { label: "NYC street", fileName: "nyc.wav", audioUrl: null },
      ],
    },
    {
      id: 3,
      author: "Priya M.",
      title: "Rainforest ambience",
      description: "A backgroundtrack i made for a video game I'm working on.",
      tags: ["game", "nature"],
      likes: 102,
      comments: 22,
      liked: false,
      audioUrl: "assets/ambulance.mp3",
      photoPreview: null,
      sourceSounds: [
        { label: "Dawn chorus", fileName: "dawn.wav", audioUrl: null },
      ],
    },
  ],
  addPost(post) {
    const entry = {
      id: Date.now(),
      author: "Mitchell W.",
      likes: 0,
      comments: 0,
      liked: false,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      ...post,
    };
    this.myPosts.unshift(entry);
    this.explorePosts.unshift({ ...entry, id: Date.now() + 1 });
  },
  addProject(project) {
    this.communityProjects.unshift({
      id: Date.now(),
      author: "Mitchell W.",
      likes: 0,
      comments: 0,
      liked: false,
      sourceSounds: [],
      ...project,
    });
  },
  toggleLike(list, id) {
    const item = list.find((p) => p.id === id);
    if (!item) return;
    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;
  },
});
