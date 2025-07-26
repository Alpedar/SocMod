export default {
  base: '/SocMod/',  // ⚠️ must match your repo name!
  root: '.',          // where index.html lives
  publicDir: false,        // we are managing public manually
  build: {
    outDir: '../dist',     // where to build final files
    emptyOutDir: true,
    rollupOptions: {
      external: ['tests/**']
    }
  }
}
