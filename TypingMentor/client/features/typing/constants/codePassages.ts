import { CodePassage } from "../types";

export const CODE_PASSAGES: CodePassage[] = [

  // ── C++ ──────────────────────────────────────────────────────────────────
  {
    id: "cpp1",
    language: "cpp",
    label: "Fibonacci (recursive)",
    text: `#include <iostream>
int fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
int main() {
  for (int i = 0; i < 10; i++) {
    std::cout << fib(i) << " ";
  }
  return 0;
}`,
  },
  {
    id: "cpp2",
    language: "cpp",
    label: "Binary search",
    text: `int binarySearch(int arr[], int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  },
  {
    id: "cpp3",
    language: "cpp",
    label: "Stack class",
    text: `template <typename T>
class Stack {
  std::vector<T> data;
public:
  void push(const T& val) { data.push_back(val); }
  void pop() { data.pop_back(); }
  T& top() { return data.back(); }
  bool empty() const { return data.empty(); }
};`,
  },
  {
    id: "cpp4",
    language: "cpp",
    label: "Bubble sort",
    text: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        std::swap(arr[j], arr[j + 1]);
      }
    }
  }
}`,
  },

  // ── Java ─────────────────────────────────────────────────────────────────
  {
    id: "java1",
    language: "java",
    label: "Linked list node",
    text: `public class ListNode {
  int val;
  ListNode next;
  ListNode(int val) { this.val = val; }
}

public ListNode reverseList(ListNode head) {
  ListNode prev = null;
  while (head != null) {
    ListNode next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}`,
  },
  {
    id: "java2",
    language: "java",
    label: "FizzBuzz",
    text: `public class FizzBuzz {
  public static void main(String[] args) {
    for (int i = 1; i <= 100; i++) {
      if (i % 15 == 0) System.out.println("FizzBuzz");
      else if (i % 3 == 0) System.out.println("Fizz");
      else if (i % 5 == 0) System.out.println("Buzz");
      else System.out.println(i);
    }
  }
}`,
  },
  {
    id: "java3",
    language: "java",
    label: "Generic pair",
    text: `public class Pair<A, B> {
  private final A first;
  private final B second;
  public Pair(A first, B second) {
    this.first = first;
    this.second = second;
  }
  public A getFirst() { return first; }
  public B getSecond() { return second; }
}`,
  },
  {
    id: "java4",
    language: "java",
    label: "HashMap word count",
    text: `public Map<String, Integer> wordCount(String[] words) {
  Map<String, Integer> map = new HashMap<>();
  for (String word : words) {
    map.put(word, map.getOrDefault(word, 0) + 1);
  }
  return map;
}`,
  },

  // ── JavaScript ───────────────────────────────────────────────────────────
  {
    id: "js1",
    language: "javascript",
    label: "Debounce",
    text: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
  },
  {
    id: "js2",
    language: "javascript",
    label: "Deep clone",
    text: `function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}`,
  },
  {
    id: "js3",
    language: "javascript",
    label: "Promise.all polyfill",
    text: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = promises.length;
    if (remaining === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}`,
  },
  {
    id: "js4",
    language: "javascript",
    label: "Flatten array",
    text: `function flatten(arr, depth = Infinity) {
  return depth > 0
    ? arr.reduce((acc, val) =>
        acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val), [])
    : arr.slice();
}`,
  },
  {
    id: "js5",
    language: "javascript",
    label: "Event emitter",
    text: `class EventEmitter {
  constructor() { this.events = {}; }
  on(event, listener) {
    (this.events[event] ||= []).push(listener);
    return this;
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(fn => fn(...args));
  }
  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(fn => fn !== listener);
  }
}`,
  },

  // ── Python ───────────────────────────────────────────────────────────────
  {
    id: "py1",
    language: "python",
    label: "Merge sort",
    text: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
  },
  {
    id: "py2",
    language: "python",
    label: "Decorator factory",
    text: `import functools

def retry(times=3):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator`,
  },
  {
    id: "py3",
    language: "python",
    label: "Binary tree",
    text: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    if root is None:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)`,
  },
  {
    id: "py4",
    language: "python",
    label: "Context manager",
    text: `class Timer:
    def __init__(self, name=""):
        self.name = name

    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self

    def __exit__(self, *args):
        import time
        elapsed = time.perf_counter() - self.start
        print(f"{self.name}: {elapsed:.4f}s")`,
  },
  {
    id: "py5",
    language: "python",
    label: "LRU cache",
    text: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        self.cache[key] = value
        self.cache.move_to_end(key)
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,
  },

  // ── Rust ─────────────────────────────────────────────────────────────────
  {
    id: "rust1",
    language: "rust",
    label: "Ownership basics",
    text: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("Longest: {}", result);
    }
}`,
  },
  {
    id: "rust2",
    language: "rust",
    label: "Enum with match",
    text: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}`,
  },
  {
    id: "rust3",
    language: "rust",
    label: "Iterator chaining",
    text: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let result: Vec<i32> = numbers
        .iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .collect();
    println!("{:?}", result);
}`,
  },
  {
    id: "rust4",
    language: "rust",
    label: "Struct with impl",
    text: `struct Stack<T> {
    elements: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { elements: Vec::new() }
    }
    fn push(&mut self, item: T) {
        self.elements.push(item);
    }
    fn pop(&mut self) -> Option<T> {
        self.elements.pop()
    }
    fn is_empty(&self) -> bool {
        self.elements.is_empty()
    }
}`,
  },
  {
    id: "rust5",
    language: "rust",
    label: "Error handling",
    text: `use std::num::ParseIntError;

#[derive(Debug)]
enum AppError {
    Parse(ParseIntError),
    NegativeNumber,
}

fn parse_positive(s: &str) -> Result<u32, AppError> {
    let n: i64 = s.parse::<i64>().map_err(AppError::Parse)?;
    if n < 0 {
        return Err(AppError::NegativeNumber);
    }
    Ok(n as u32)
}`,
  },
];
