## 👔 Example User Api

This is showcase of user api - created on [generic-auth app](https://generic-auth.vercel.app/) purpose.

> [!NOTE]  
> Only user-credentials based authorization (email-password) is available at this time

## 🥢 Endpoints

Api accepts two endpoints:

<ul>
<li>(<i>POST</i>) <b>*api-prefix*/user/</b> - resource resposible for login of user
    <br />
    Request body:
    <ul>
        <li>!email (<i>:string</i>)</li>
        <li>!password (<i>:string</i>)</li>
        <li>!provider (<i>:'jwt'</i>) - only jwt supported</li>
        <li>idFromProvider? (<i>:string</i>) - id provided by external authentication source (github/google/fb)</li>
        <li>picture? (<i>:string</i>) - path for user picture (url)</li>
        <li>name? (<i>:string</i>) - name of user</li>
    </ul>
</li>
<li>(<i>PUT</i>) <b>*api-prefix*/user/</b> - update action of user (requires valid jwt token)
    <br />
    Request body: 
    <ul>
        <li>name? (<i>:string</i>)</li>
        <li>password? (<i>:string</i>)</li>
        <li>picture? (<i>:string</i>)</li>
    </ul>
</li>
</ul>

, where <b>api-prefix</b> is set to <i>api</i>.

---

**NOTE**

Properties with: <b>!</b> are required, with <b>?</b> are optional

---

## 👨🏻‍💻 Internals

### 🛢 Database

Api establishes connection to mongodb atlas database. Only **UserSchema** is described

```ts
@Schema()
export class UserModel {
  private static readonly DEFAULT_USER_PICTURE_URL =
    'https://www.svgrepo.com/show/141833/user-placeholder.svg';
  private static readonly DEFAULT_USER_NAME = 'Unknown User';
  // won't be required in case of github auth
  // second approach - put placeholder here id+login@users.noreply.github.com
  @Prop()
  email: string;

  @Prop({})
  idFromProvider?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  provider: Extract<AuthType, 'jwt'>;

  @Prop({
    default: UserModel.DEFAULT_USER_PICTURE_URL,
  })
  picture?: string;

  @Prop({
    default: UserModel.DEFAULT_USER_NAME,
  })
  name?: string;
}
```

### ⚡ Deployment

Api is intended to work as serverless REST API. To be more precise - work as a [aws lambda](https://aws.amazon.com/lambda/) service. Whole config is exposed in 'serverless.yml' file.

```yml
service: serverless-example

useDotenv: true

plugins:
  - serverless-offline

provider:
  name: aws
  runtime: nodejs18.x
  region: eu-north-1
  environment:
    DATABASE_URI: ${env:DATABASE_URI}
    PORT: ${env:PORT}
    JWT_SECRET: ${env:JWT_SECRET}
    JWT_EXPIRES_IN_SEC: ${env:JWT_EXPIRES_IN_SEC}

functions:
  main:
    handler: dist/main.handler
    events:
      - http:
          method: ANY
          path: /
      - http:
          method: ANY
          path: '{proxy+}'
```

Serverless api is exposed on [that address](https://0jtx99g2qi.execute-api.eu-north-1.amazonaws.com/prod/api/)

## 🔨 Technologies

| Lib                           | Version |
| ----------------------------- | ------- |
| Nest.js                       | ^10.0.0 |
| aws-lambda                    | ^1.0.7  |
| argon2                        | ^0.41.1 |
| class-validator               | ^0.14.1 |
| mongoose                      | ^8.9.3  |
| @codegenie/serverless-express | ^4.16.0 |
