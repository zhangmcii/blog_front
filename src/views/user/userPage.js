export default {
  data() {
    return {
    
    };
  },
  async mounted() {
    this.setMainProperty();
  },
  methods: {
    setMainProperty() {
      const root = document.documentElement;
      root.style.setProperty('--leleo-background-image-url', `url('/src/asset/image.png')`);
    }
  }
};