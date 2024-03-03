import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
    overrides: {
      curly: ['error', 'multi', 'consistent'],
    },
  },
  // ignores: [
  //   "!.playground",
  // ],
});
