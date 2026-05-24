
export enum CoverstockType {
  SOLID = 'Solid Reactive',
  PEARL = 'Pearl Reactive',
  HYBRID = 'Hybrid Reactive',
  URETHANE = 'Urethane',
  PLASTIC = 'Plastic/Polyester'
}

export interface MaintenanceTask {
  id: string;
  name: string;
  intervalGames: number;
  lastDoneAtGameCount: number;
}

export interface BowlingBall {
  id: string;
  name: string;
  brand: string;
  coverstock: CoverstockType;
  surfaceFinish: string;
  totalGames: number;
  maintenanceTasks: MaintenanceTask[];
  imageUrl?: string;
}

export interface MaintenanceAlert {
  ballName: string;
  taskName: string;
  gamesOverdue: number;
}
