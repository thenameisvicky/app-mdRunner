## Mental Model

| Question                                                            | Pattern                              |
| ------------------------------------------------------------------- | ------------------------------------ |
| Will UI parts need to be reused differently across pages?           | Compound Component                   |
| Does logic need to be shared across many components?                | Custom Hook                          |
| Should parts of the component render differently based on children? | Render Props                         |
| Do you want a consistent visual or interaction standard?            | Component Composition                |
| Do you want behaviour encapsulated and decoupled from UI?           | Container-Presenter                  |
| Do you want a clean API for a complex system?                       | Facade                               |
| Do you want multiple UI states handled predictably?                 | State Machine / Reducer              |
| Do you want one-way data flow with predictable events?              | Observer (Event Emitter / Pub-Sub)   |
| Do you need different strategies for UI behaviour?                  | Strategy via Hook or Props Injection |
| Do you want cross-cutting logic applied cleanly?                    | HOC / Hook Decorators                |

## Philosophies
- **Component First** 
    Break UI into reusable, isolated components. Even a modal, card, or tooltip should be a single unit.
    
- **Single Responsibility**
    Each component should do one thing. Avoid putting fetch + render + logic into a single file.
    
- **Composable > Inheritance**
    Compose features (props, hooks, slots), don’t extend base classes.
    
- **Data Flows Down, Events Bubble Up**
    Keep one-way data flow. Parent passes state; child emits events.
    
- **State Lives at the Right Level**
    Don’t lift state unnecessarily. Let it live where it’s used, or in a shared hook if global.
    
- **Configurable & Extendable**
    Good components allow: `className`, `as`, `onClick`, `aria-*`, `disabled`, `variant`.
    
- **Write Once, Use Everywhere**
    Write UI like a library—build once, use in 10 places with props.

## Container - Presenter Pattern
- Split the logic from UI.
- Mostly used in Pages, data-driven components.

```jsx
function CustomerListContainer() {
  const { data, loading } = useCustomers();
  return <CustomerList data={data} loading={loading} />;
}

function CustomerList({ data, loading }) {
  if (loading) return <Loader />;
  return <ul>{data.map(d => <li>{d.name}</li>)}</ul>;
}
```

## Compound component Pattern
- Parent-child relationship with shared context.
- Mostly used in Tabs, Accordion, Menu, NavBar, Modal.

```jsx
type TabsContext = { selected: number; setSelected: (i: number) => void };
const TabsContext = React.createContext<TabsContext | null>(null);

function Tabs({ children }) {
  const [selected, setSelected] = useState(0);
  return (
    <TabsContext.Provider value={{ selected, setSelected }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ index, children }) {
  const ctx = useContext(TabsContext)!;
  return (
    <button
      className={ctx.selected === index ? "active" : ""}
      onClick={() => ctx.setSelected(index)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }) {
  const ctx = useContext(TabsContext)!;
  return <div>{children[ctx.selected]}</div>;
}
```

## Custom Hooks Pattern
- Encapsulate shared stateful logic.
- Mostly used in Scroll, Auth, Debounce, MediaQuery, etc.

```jsx
function useScrollPosition() {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const onScroll = () => setPos(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return pos;
}

function Navbar() {
  const scrollY = useScrollPosition();
  return <header className={scrollY > 50 ? 'small' : 'large'}>Nav</header>;
}
```

## Render Props Pattern
- Passing a function as a child which returns JSX, giving flexible rendering control.
- When parent component need to give internal state to children.

```jsx
function Tooltip({ render }) {
  const [open, setOpen] = useState(false);
  return (
    <span onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {render({ open })}
    </span>
  );
}

<Tooltip render={({ open }) => <div>{open ? "👆 Hovered!" : "Hover me"}</div>} />
```

## Higher-Order Component Pattern ( HOC )
- A function that wraps the component to inject extra behaviour or props.
- For cross cutting concerns like render only if.

```jsx
function withAuth<P>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const isAuth = useAuth();
    return isAuth ? <Component {...props} /> : <Redirect to="/login" />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

## Reducer Pattern
- Manage UI state transitions with useReducer like updating store.
- Used to manage complex UIs with multiple states.

```jsx
type State = { status: 'idle' | 'loading' | 'success' | 'error'; data?: any; error?: string };
type Action = { type: 'FETCH' } | { type: 'RESOLVE'; data: any } | { type: 'REJECT'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH': return { status: 'loading' };
    case 'RESOLVE': return { status: 'success', data: action.data };
    case 'REJECT': return { status: 'error', error: action.error };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, { status: 'idle' });
```

## Component Composition Pattern
- Building UI by combining small, focused components.
- Always use this pattern have custom component and reuse them.

```jsx
function Modal({ children }) {
  return <div className="modal">{children}</div>;
}

function ModalHeader({ title }) {
  return <div className="modal-header">{title}</div>;
}

<Modal>
  <ModalHeader title="Confirm Delete" />
  <ModalBody>Are you sure?</ModalBody>
  <ModalFooter>
    <Button>Cancel</Button>
    <Button>Delete</Button>
  </ModalFooter>
</Modal>
```

## Facade Pattern
- Simplified interface that abstracts complexity of multiple operations.
- Used when grouping related services such as toast notification, logging in to kibana, etc..

```jsx
function useNotificationFacade() {
  const send = (msg: string) => {
    toast(msg);
    analytics.track('notification_sent', { msg });
    console.log('[NOTIF]', msg);
  };
  return { send };
}

const { send } = useNotificationFacade();
send('Campaign sent successfully!');
```

## Command Pattern
- Encapsulates UI actions in reusable command objects, enabling, undo/redo or queuing
- Used when Builder interface like going back to recent changes , undo, redo stuffs.

```jsx
interface Command {
  execute(): void;
  undo(): void;
}

class AddCardCommand implements Command {
  constructor(private board: Board, private card: Card) {}
  execute() {
    this.board.addCard(this.card);
  }
  undo() {
    this.board.removeCard(this.card.id);
  }
}
```

## Observer Pattern
- Emit and listen for events across the application decoupled from component hierarchy.
- Used when Global notifications, custom event busses, decoupled UI.

```jsx
class EventBus {
  private listeners = new Map<string, Set<Function>>();
  on(event: string, fn: Function) {
    (this.listeners.get(event) ?? this.listeners.set(event, new Set())).add(fn);
  }
  emit(event: string, payload?: any) {
    this.listeners.get(event)?.forEach(fn => fn(payload));
  }
}
const bus = new EventBus();

bus.on('campaign.sent', campaignId => console.log('Sent:', campaignId));

bus.emit('campaign.sent', 123);
```

## Accessibility Pattern

## Portals

## Memoizations & Re-renders

## State Management Patterns

## Atomic design Implementation

## Performance Optimization Techiniques