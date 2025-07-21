// Test file with formatting and linting issues
const a = 1
const b = 2
// console.log removed due to no-console rule

// Function is now exported and used
export function test() {
  const c = 3 // Now using const
  return a + b + c
}

// Using the function
const result = test()
export default result
