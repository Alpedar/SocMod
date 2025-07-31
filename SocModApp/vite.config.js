export default {
  base: '/SocMod/',  // ⚠️ must match your repo name!
  root: '.',          // where index.html lives
  // publicDir: 'public', // (optional, 'public' is default)
  build: {
    outDir: '../dist',     // where to build final files
    emptyOutDir: true,
    rollupOptions: {
      external: ['tests/**']
    }
  }
}
