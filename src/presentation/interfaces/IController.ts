// Презентаційний рівень - інтерфейси контролерів
// На даний момент не виконує жодної логіки

export interface IController {
  handleRequest(request: any): Promise<any>;
}
