import { Reflector } from '@nestjs/core';

const Roles = Reflector.createDecorator<string[]>();
