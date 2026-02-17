module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@api$': '<rootDir>/src/utils/burger-api',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@services(.*)$': '<rootDir>/src/services/$1',
    '^@slices(.*)$': '<rootDir>/src/services/slices/$1',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
