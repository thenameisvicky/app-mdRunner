---
title: Design Patterns - Backend
date: 2025-07-03
---

## Mental Model

| Question                                      | Pattern         |
| --------------------------------------------- | --------------- |
| Will behaviour change dynamically at runtime? | Strategy        |
| Do I need to create object variants?          | Factory         |
| Do I need to chain creation steps?            | Builder         |
| Do I want only one instance globally?         | Singleton       |
| Do I need to respond to events?               | Observer        |
| Am I integrating with inconsistent APIs?      | Adapter         |
| Do I need to simplify complex logic?          | Facade          |
| Do I need to queue/undo/retry actions?        | Command         |
| Do I want base flow with extensible steps?    | Template Method |
## Philosophies
- Separation of concerns
    - Each part of code base should address one concern or functionality.
    - This makes it easier to debug, maintain and scale.
    - Keep business logics outside controllers , write logics in a file named modulename.ts in the module folder.
- Single Responsibility Principle
    - A class/module/function should have one reason to change.
    - usermodule.ts will handle user’s stuffs not other stuffs like export or view strategy or notification things
    - This keeps the code base clean and easier to extend.
- Design for Failure
    - Assume system will fail, networks, dependencies, services and build.
    - Have retries for stuffs like queue consumer and only for stuffs that matter the most.
    - This imporve the code logic and failure free backend.
- Defensive Programming
    - Anticipate and Guard against bad inputs, edge cases or unexpected states.
    - Prevents failure and easy to debug.
- Don’t Repeat yourself ( DRY )
    - Avoid duplicate logic or knowledge in multiple places.
    - Centralise knowledge and makes updates easier.
- Loggers
    - Must have loggers and track them easy to reproduce or debug the issue.

## S.O.L.I.D

- **S** - A Class / Module should have only one reason to change / only one responsibility.
    
    ```Ts
    class User {
      constructor(public name: string, public email: string) {}
    }
    
    class UserRepository {
      save(user: User) {
        // Save user to database
      }
    }
    
    class EmailService {
      sendEmail(email: string, message: string) {
        // Send email
      }
    }
    ```
    
- **O** - Software entities should be open for extension, but closed for modification.
    

```Ts
interface DiscountStrategy {
  getDiscount(): number;
}

class RegularDiscount implements DiscountStrategy {
  getDiscount() {
    return 10;
  }
}

class PremiumDiscount implements DiscountStrategy {
  getDiscount() {
    return 20;
  }
}

class Discount {
  constructor(private strategy: DiscountStrategy) {}

  getDiscount() {
    return this.strategy.getDiscount();
  }
}
```

- **L** - ****Subtypes must be substitutable for their base types.

```Ts
interface Bird {
  eat(): void;
}

interface FlyingBird extends Bird {
  fly(): void;
}

class Sparrow implements FlyingBird {
  eat() {
    console.log('Sparrow eats');
  }
  fly() {
    console.log('Sparrow flies');
  }
}

class Ostrich implements Bird {
  eat() {
    console.log('Ostrich eats');
  }
}
```

- **I** - Client should not be forced to depend on methods they do not use.

```Ts
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

class Human implements Workable, Eatable {
  work() {
    console.log('Human working');
  }

  eat() {
    console.log('Human eating');
  }
}

class Robot implements Workable {
  work() {
    console.log('Robot working');
  }
}
```

- **D** - Depend on abstractions, not concrete implementations.

```Ts
interface Database {
  save(data: string): void;
}

class MySQLDatabase implements Database {
  save(data: string) {
    console.log('Saving to MySQL:', data);
  }
}

class MongoDatabase implements Database {
  save(data: string) {
    console.log('Saving to MongoDB:', data);
  }
}

class App {
  constructor(private db: Database) {}

  saveData(data: string) {
    this.db.save(data);
  }
}

const db = new MySQLDatabase();
const app = new App(db);
```

## Strategy Pattern
- Selects different algorithms dynamically.
- Can use for authenticating different logins , exports , imports, views and so on.

```Ts
interface AuthStrategy {
  authenticate(data: any): Promise<User>;
}

class OtpAuth implements AuthStrategy {
  async authenticate(data) {
  }
}

class GoogleAuth implements AuthStrategy {
  async authenticate(data) {
  }
}

class AuthContext {
  constructor(private strategy: AuthStrategy) {}
  async execute(data: any) {
    return this.strategy.authenticate(data);
  }
}
```

## Factory Pattern
- Creates different objects types based on inputs.
- Creating message for clients.
- Creating notification channels.
- Creating validators for forms.

```Ts
class AlertFactory {
  static create(type: 'sms' | 'email' | 'whatsapp') {
    switch (type) {
      case 'sms': return new SmsSender();//strategy
      case 'email': return new EmailSender();//strategy
      case 'whatsapp': return new WhatsAppSender();//strategy
    }
  }
}
```

## Builder Pattern
- Create Complex objects step by step.
- Building User Profile for Ai matching / Dynamic Content rendering.
- Building Summary reports.
- Building internal quiz ( as teacher creates the questions and schedules ).

```Ts
class ProfileBuilder {
  constructor() {
    this.profile = {};
  }
  setLanguage(lang) { this.profile.language = lang; return this; }
  setSubject(subject) { this.profile.subject = subject; return this; }
  build() { return this.profile; }
}
```

## Singleton Pattern
- One Global instance across the Application.
- Can use this to check if all request is validated by the Auth microservice.
- Can use as logger instance.
- Can use as Redis client connection to redis and starting consumer.
- Pooling a Flow.

```Ts
class Logger {
  private static instance: Logger;
  private constructor() {}
  static getInstance() {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
}
```

## Observer Pattern
- Listen to events inside Application and notifi appropiate services or client.
- Can used for sending messages among microserivices, establishing a connection share datas, and stuffs.
- When a class ends, send alerts (email + SMS + dashboard update).
- On subscription expiry, notify all systems.
- On lead booking, inform tutor, student, and log system.

```Ts
//kafka 
eventEmitter.on('class.ended', () => {
  alertService.sendSMS();
  alertService.sendEmail();
  dashboardService.updateTimeline();
});
```

## Adapter Pattern
- Normalize 3rd party integrations in Applications.
- Used when Integrating stripe, razor pay, chargebee kinda having multiple stream doing same thing.
- Whatsapp Puppeteer instance or APIs and Whatsmeow.
- Google / Outlook calendar integration.

```Ts
class StripeAdapter {
  pay(amount) { return stripe.charge(amount); }
}

class RazorpayAdapter {
  pay(amount) { return razorpay.capturePayment(amount); }
}
```

## Facade Pattern
- Simple API over complex subsystems.
- Unifying message sending (SMS/WA/Email).
- Simplified Streaming API for frontend.
- Dashboard summary for students.

```Ts
class NotificationFacade {
  sendAll(user, message) {
    sms.send(user.phone, message);
    email.send(user.email, message);
    whatsapp.send(user.waId, message);
  }
}
```

## Command Pattern
- Encapsulate actions as objects for queues and retries.
- Used in send campaign message jobs.
- Retry failed webhooks.
- Reschedule class.

```Ts
class SendMessageCommand {
  constructor(private campaignId) {}
  execute() {
  }
}
```

## Template Method
- Base Algorithm with customizable steps.
- Email pipeline with custom headers/footers.
- Subscription plan billing flow.
- Session summary generation.

```Ts
class BaseEmail {
  send() {
    this.preProcess();
    this.composeBody();
    this.sendMail();
  }
  preProcess() {}
  composeBody() { throw "Implement this"; }
  sendMail() {}
}
```
