import { ManageQueueModule } from './manage-queue.module';

describe('ManageQueueModule', () => {
  let manageQueueModule: ManageQueueModule;

  beforeEach(() => {
    manageQueueModule = new ManageQueueModule();
  });

  it('should create an instance', () => {
    expect(manageQueueModule).toBeTruthy();
  });
});
